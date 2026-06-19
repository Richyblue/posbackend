const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const Customer = require("../models/Customer");
const User =require("../models/User");
const staff =require("../models/Staff");
const Staff = require("../models/Staff");

const Sale = sequelize.define("Sale", {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    totalAmount: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
    },
    saleType: {
        type: DataTypes.ENUM(
            "service",
            "product",
            "mixed"
        ),
        defaultValue: "service"
    },

    receiptNumber: {
        type: DataTypes.STRING,
        unique: true
    },

    approvalStatus: {
        type: DataTypes.ENUM(
            "pending",
            "approved",
            "declined"
        ),
        defaultValue: "pending"
    },

    subtotal: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
      },
      
      discount: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
      },
      
      paymentMethod: {
        type: DataTypes.ENUM(
          "cash",
          "transfer",
          "pos",
          "mixed"
        ),
        defaultValue: "cash"
      },
      
      pointsUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    status: {
        type: DataTypes.ENUM(
            "completed",
            "refunded",
            "voided"
        ),
        defaultValue: "completed"
    }
});

Customer.hasMany(Sale);
Sale.belongsTo(Customer);

User.hasMany(Sale, {
    as: "RecordedSales"
});

Sale.belongsTo(User, {
    as: "RecordedBy"
});

Staff.hasMany(Sale, {
    as: "ServiceSales"
  })
  
  Sale.belongsTo(Staff, {
    as: "ServiceProvider"
  })

module.exports=Sale;