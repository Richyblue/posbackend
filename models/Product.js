const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const Product = sequelize.define(
    "Product",
    {
  
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
  
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      sku: {
        type: DataTypes.STRING,
        unique: true
      },
  
      barcode: {
        type: DataTypes.STRING
      },
  
      costPrice: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
      },
  
      sellingPrice: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
      },
  
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
  
      reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      },
  
      image: {
        type: DataTypes.STRING
      },
  
      status: {
        type: DataTypes.ENUM(
          "active",
          "inactive"
        ),
        defaultValue: "active"
      }
  
    },
    {
      paranoid: true
    }
  );

  module.exports=Product;