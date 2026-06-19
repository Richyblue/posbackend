
const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const User = sequelize.define("User", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        unique: true
    },

    phone: {
        type: DataTypes.STRING
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM(
            "admin",
            "manager",
            "cashier",
            "staff"
        ),
        defaultValue: "staff"
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports=User;