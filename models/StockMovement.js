const { DataTypes } =
require("sequelize");

const sequelize =
require("../config/db");

const Product =
require("./Product");

const User =
require("./User");

const StockMovement =
sequelize.define(
"StockMovement",
{

  id: {
    type:
      DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  movementType: {
    type:
      DataTypes.ENUM(
        "purchase",
        "sale",
        "adjustment",
        "damage",
        "return"
      ),
    allowNull: false
  },

  quantity: {
    type:
      DataTypes.INTEGER,
    allowNull: false
  },

  previousStock: {
    type:
      DataTypes.INTEGER,
    defaultValue: 0
  },

  currentStock: {
    type:
      DataTypes.INTEGER,
    defaultValue: 0
  },

  note: {
    type:
      DataTypes.TEXT
  }

});

Product.hasMany(
  StockMovement
);

StockMovement.belongsTo(
  Product
);

User.hasMany(
  StockMovement
);

StockMovement.belongsTo(
  User
);

module.exports =
StockMovement;