const { Op, fn, col, literal } = require("sequelize");

const sequelize = require("../config/db");

const Sale = require("../models/Sale");

const Expense = require("../models/Expense");

const Commission = require("../models/Commission");

const Product = require("../models/Product");

const Customer = require("../models/Customer");

const Staff = require("../models/Staff");

const SaleItem = require("../models/saleItem");
const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    /*
DAILY
*/

    const todaySales = await Sale.sum("totalAmount", {
      where: {
        approvalStatus: "approved",

        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const todayTransactions = await Sale.count({
      where: {
        approvalStatus: "approved",

        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const todayExpenses = await Expense.sum("amount", {
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const todayCommission = await Commission.sum("commissionAmount", {
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    /*
MONTHLY
*/

    const monthSales = await Sale.sum("totalAmount", {
      where: {
        approvalStatus: "approved",

        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    const monthExpenses = await Expense.sum("amount", {
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    const monthCommission = await Commission.sum("commissionAmount", {
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    /*
COUNTS
*/

    const totalProducts = await Product.count();

    const totalCustomers = await Customer.count();

    const totalStaff = await Staff.count();

    /*
LOW STOCK
*/

    const lowStockProducts = await Product.count({
      where: {
        quantity: {
          [Op.lte]: literal("`reorderLevel`"),
        },
      },
    });

    const outOfStockProducts = await Product.count({
      where: {
        quantity: 0,
      },
    });

    /*
PENDING COMMISSION
*/

    const pendingCommission = await Commission.sum("commissionAmount", {
      where: {
        status: "pending",
      },
    });

    /*
TOP PRODUCTS
*/

    const topProducts = await SaleItem.findAll({
      attributes: ["ProductId", [fn("SUM", col('SaleItem.quantity')), "totalSold"]],

      group: ["ProductId"],

      order: [[literal("totalSold"), "DESC"]],

      limit: 5,

      include: [
        {
          model: Product,
          attributes: ["id", "name"],
        },
      ],
    });

    /*
TOP STAFF
*/

    const topStaff = await Commission.findAll({
      attributes: [
        "StaffId",

        [fn("SUM", col("commissionAmount")), "totalCommission"],
      ],

      group: ["StaffId"],

      order: [[literal("totalCommission"), "DESC"]],

      limit: 5,

      include: [
        {
          model: Staff,
          attributes: ["id"],
      
          include: [
            {
              model: User,
              attributes: [
                "id",
                "fullname"
              ]
            }
          ]
        }
      ]
    });

    /*
LAST 7 DAYS SALES
*/

    const sevenDaysSales = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();

      day.setDate(day.getDate() - i);

      const start = new Date(day);

      start.setHours(0, 0, 0, 0);

      const end = new Date(day);

      end.setHours(23, 59, 59, 999);

      const total = await Sale.sum("totalAmount", {
        where: {
          approvalStatus: "approved",

          createdAt: {
            [Op.between]: [start, end],
          },
        },
      });

      sevenDaysSales.push({
        date: start.toISOString().split("T")[0],

        sales: total || 0,
      });
    }

    return res.status(200).json({
      success: true,

      dashboard: {
        todaySales: todaySales || 0,

        todayTransactions: todayTransactions || 0,

        todayExpenses: todayExpenses || 0,

        todayCommission: todayCommission || 0,

        todayProfit:
          (todaySales || 0) - (todayExpenses || 0) - (todayCommission || 0),

        monthSales: monthSales || 0,

        monthExpenses: monthExpenses || 0,

        monthCommission: monthCommission || 0,

        monthProfit:
          (monthSales || 0) - (monthExpenses || 0) - (monthCommission || 0),

        totalProducts,

        totalCustomers,

        totalStaff,

        lowStockProducts,

        outOfStockProducts,

        pendingCommission: pendingCommission || 0,

        topProducts,

        topStaff,

        sevenDaysSales,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

module.exports = getDashboard;
