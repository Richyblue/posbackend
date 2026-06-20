const sequelize = require("../config/db");

const Sale = require("../models/Sale");
const SaleItem = require("../models/saleItem");

const Product = require("../models/Product");
const Service = require("../models/Service");

const Customer = require("../models/Customer");
const Staff = require("../models/Staff");

const Commission = require("../models/Commission");

const LoyaltyCard = require("../models/loyaltyCard");
const LoyaltyTransaction = require("../models/loyaltyTransaction");
const { saveSaleOffline } =require('../service/offlineQueue');
exports.createPOSSale = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      customerId,
      staffId,
      items,
      discount = 0,
      paymentMethod = "cash",
      usePoints = false,
      redeemPoints = 0,
      note = "",
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items selected",
      });
    }

    const receiptNumber = `SAL-${Date.now()}`;

    let subtotal = 0;

    let totalAmount = 0;

    let pointsUsed = 0;
    let serviceTotal = 0;

    let saleType = "mixed";

    const saleItems = [];

    /*
     Customer
    */

    const customer = customerId
      ? await Customer.findByPk(customerId, { transaction })
      : null;

    /*
     Create Sale
    */
    const hasProduct = items.some((item) => item.type === "product");

    const hasService = items.some((item) => item.type === "service");

    if (hasProduct && hasService) {
      saleType = "mixed";
    } else if (hasProduct) {
      saleType = "product";
    } else {
      saleType = "service";
    }
    const sale = await Sale.create(
      {
        CustomerId: customerId || null,

        RecordedById: req.user.id,

        receiptNumber,

        saleType,

        subtotal: 0,

        discount,

        pointsUsed: 0,

        paymentMethod,

        totalAmount: 0,

        approvalStatus: "approved",
      },
      {
        transaction,
      }
    );

    /*
     Process Items
    */

    for (const item of items) {
      let price = 0;

      let itemSubtotal = 0;

      /*
       SERVICE
      */

      if (item.type === "service") {
        const service = await Service.findByPk(item.serviceId || item.id);

        if (!service) {
          throw new Error("Service not found");
        }

        price = Number(service.price);

        itemSubtotal = price * item.quantity;

        serviceTotal += itemSubtotal;

        await SaleItem.create(
          {
            SaleId: sale.id,

            ServiceId: service.id,

            itemType: "service",

            quantity: item.quantity,

            price,

            subtotal: itemSubtotal,
          },
          {
            transaction,
          }
        );

        saleItems.push({
          id: service.id,

          name: service.name,

          quantity: item.quantity,

          subtotal: itemSubtotal,
        });
      }

      /*
       PRODUCT
      */

      if (item.type === "product") {
        const product = await Product.findByPk(item.productId || item.id);

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.quantity < item.quantity) {
          throw new Error(`${product.name} out of stock`);
        }

        price = Number(product.sellingPrice);

        itemSubtotal = price * item.quantity;

        await SaleItem.create(
          {
            SaleId: sale.id,

            ProductId: product.id,

            itemType: "product",

            quantity: item.quantity,

            price,

            subtotal: itemSubtotal,
          },
          {
            transaction,
          }
        );

        product.quantity -= item.quantity;

        await product.save({
          transaction,
        });

        db.run(
          `
          UPDATE products
          SET quantity = ?
          WHERE id = ?
          `,
          [
            product.quantity,
            product.id
          ]
         );

        saleItems.push({
          id: product.id,

          name: product.name,

          quantity: item.quantity,

          subtotal: itemSubtotal,
        });
      }

      subtotal += itemSubtotal;
    }

    /*
     Apply Discount
    */

    totalAmount = subtotal - Number(discount || 0);

    /*
 EARN LOYALTY POINTS
*/

    let earnedPoints = 0;

    if (customer) {
      earnedPoints = Math.floor(totalAmount / 100);

      customer.loyaltyPoints =
        Number(customer.loyaltyPoints || 0) + earnedPoints;

      await customer.save({
        transaction,
      });

      await LoyaltyTransaction.create(
        {
          CustomerId: customer.id,

          type: "earn",

          points: earnedPoints,

          reference: receiptNumber,
        },
        {
          transaction,
        }
      );
    }
    /*
     Earn New Points
    */

    if (customer) {
      earnedPoints = Math.floor(totalAmount / 1000);

      customer.loyaltyPoints += earnedPoints;

      await customer.save({
        transaction,
      });

      await LoyaltyTransaction.create(
        {
          CustomerId: customer.id,

          type: "earn",

          points: earnedPoints,

          reference: receiptNumber,
        },
        {
          transaction,
        }
      );
    }

    /*
     Update Sale
    */

    sale.subtotal = subtotal;

    sale.discount = discount;

    sale.pointsUsed = pointsUsed;

    sale.paymentMethod = paymentMethod;

    sale.totalAmount = totalAmount;

    await sale.save({
      transaction,
    });

    /*
 STAFF COMMISSION
*/

    if (staffId) {
      const staff = await Staff.findByPk(staffId, {
        transaction,
      });

      if (staff) {
        const employmentType = staff.employmentType;

        if (
          employmentType === "commission" ||
          employmentType === "salary_and_commission"
        ) {
          const rate = Number(staff.commissionRate || 0);

          if (
            serviceTotal > 0 &&
            staff &&
            Number(staff.commissionRate) > 0
          ) {
          
            const commissionAmount =
              (
                serviceTotal *
                Number(staff.commissionRate)
              ) / 100
          
            await Commission.create({
              StaffId: staff.id,
              SaleId: sale.id,
              commissionRate:
                staff.commissionRate,
              commissionAmount,
              commissionDate:
                new Date(),
              status: "pending",
            }, {
              transaction,
            })
          }
        }
      }
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,

      message: "Sale completed successfully",

      sale: {
        id: sale.id,

        receiptNumber,

        customer: customer?.fullname || "Walk-in Customer",

        items: saleItems,

        subtotal,

        discount,

        pointsUsed,

        paymentMethod,

        totalAmount,

        loyaltyPointsEarned: earnedPoints,

        remainingPoints: customer?.loyaltyPoints || 0,
      },
    });
  } catch (error) {

    await transaction.rollback();
  
    if (
        error.code === 'ECONNREFUSED' ||
        error.name === 'SequelizeConnectionError' ||
        error.name === 'SequelizeConnectionRefusedError'
    ) {
  
        await saveSaleOffline({
          body:req.body,
          user:req.user
        });
  
        return res.status(200).json({
          success:true,
          offline:true,
          message:'Sale saved offline and will sync later'
        });
  
    }
  
    return res.status(500).json({
        success:false,
        message:error.message
    });
  
  }
};
