const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const Expense = sequelize.define("Expense", {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    title: {
        type: DataTypes.STRING
    },

    amount: {
        type: DataTypes.DECIMAL(12,2)
    },

    category: {
        type: DataTypes.STRING
    }
});

module.exports=Expense;