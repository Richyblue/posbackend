const DataTypes = require("sequelize")
const sequelize = require("../config/db")

const Setting = sequelize.define("Setting", {
  companyName: DataTypes.STRING,
  companyPhone: DataTypes.STRING,
  companyEmail: DataTypes.STRING,
  companyAddress: DataTypes.TEXT,

  currency: {
    type: DataTypes.STRING,
    defaultValue: "NGN"
  },

  currencySymbol: {
    type: DataTypes.STRING,
    defaultValue: "₦"
  },

  defaultCommissionRate: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 10
  },

  loyaltyPointRate: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },

  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },

  taxRate: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 0
  },

  autoApproveSales: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  allowNegativeStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  receiptFooter: DataTypes.TEXT
})

module.exports = Setting