const User = require("../models/User");
const Staff = require("../models/Staff");
const db =require('../config/offlineDb');
exports.createStaff = async (
  req,
  res
) => {

  try {

    const {

      fullname,
      email,
      phone,
      username,
      password,
      role,

      position,
      salary,
      employmentType,

      hmoProvider,
      hmoNumber,

      commissionRate,
      commissionCycle

    } = req.body;

    const existingUser =
      await User.findOne({

        where: {
          email
        }

      });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        message:
          "Email already exists"

      });

    }

    const user =
      await User.create({

        fullname,
        email,
        phone,
        username,
        password,
        role

      });

    const staff =
      await Staff.create({

        UserId:
          user.id,

        position,

        salary,

        employmentType,

        hmoProvider,

        hmoNumber,

        commissionRate,

        commissionCycle

      });

    return res.status(201).json({

      success: true,

      message:
        "Staff created successfully",

      user,
      staff

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

};

exports.getStaff = async (
    req,
    res
  ) => {
  
    try {
  
      const staffs =
        await Staff.findAll({
  
          include: [
            {
              model: User,
              attributes: [
                "id",
                "fullname",
                "email",
                "phone",
                "role",
                "isActive"
              ]
            }
          ]
  
        })
  
      return res.status(200).json({
  
        success: true,
  
        staffs
  
      })
  
    } catch (error) {

      console.error(error);
    
      db.all(
        `
        SELECT *
        FROM staffs
        ORDER BY fullname ASC
        `,
        [],
        (err,rows)=>{
    
          if(err){
    
            return res.status(500).json({
    
              success:false,
    
              message:err.message
    
            });
    
          }
    
          return res.status(200).json({
    
            success:true,
    
            offline:true,
    
            staffs:rows
    
          });
    
        }
      );
    
    }
  
  }