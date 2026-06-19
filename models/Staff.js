const DataTypes=require("sequelize");
const sequelize=require("../config/db");
const User =require("../models/User");
const Staff = sequelize.define("Staff", {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    position: {
        type: DataTypes.STRING
    },

    salary: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
    },


    employmentType: {
        type: DataTypes.ENUM(
            "salary",
            "commission",
            "salary_and_commission"
        )
    },

    hmoProvider: {
        type: DataTypes.STRING
    },

    hmoNumber: {
        type: DataTypes.STRING
    },

    commissionRate: {
        type: DataTypes.DECIMAL(5,2),
        defaultValue: 0
    },
    
    commissionCycle: {
        type: DataTypes.ENUM(
            "daily",
            "weekly",
            "monthly"
        ),
        defaultValue: "monthly"
    }
});

User.hasOne(Staff);
Staff.belongsTo(User);

module.exports=Staff;