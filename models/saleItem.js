const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const Sale =require("../models/Sale");
const Service =require("../models/Service");
const Product =require("../models/Product");

const SaleItem = sequelize.define("SaleItem", {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    price: {
        type: DataTypes.DECIMAL(12,2)
    },

    subtotal: {
        type: DataTypes.DECIMAL(12,2)
    },
    itemType: {
        type: DataTypes.ENUM(
            "service",
            "product"
        )
    }
});
Sale.hasMany(SaleItem);
SaleItem.belongsTo(Sale);

Service.hasMany(SaleItem);
SaleItem.belongsTo(Service);

Product.hasMany(SaleItem);
SaleItem.belongsTo(Product);

module.exports=SaleItem;