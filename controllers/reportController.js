const { Op } = require("sequelize")

const Sale = require("../models/Sale")
const saleItem = require("../models/saleItem")
const Customer = require("../models/Customer")
const Staff = require("../models/Staff")
const User = require("../models/User")

const getSalesReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
    } = req.query

    let where = {}

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [
          new Date(startDate),
          new Date(endDate),
        ],
      }
    }

    if (status) {
      where.approvalStatus = status
    }

    const sales = await Sale.findAll({
        where,
        include: [
          {
            model: Customer,
            attributes: [
              "id",
              "fullname",
              "phone"
            ],
            
          },
      
          {
            model: User,
            as: "RecordedBy",
      
            attributes: [
              "id",
              "fullname"
            ],
            
          },
      
          {
            model: Staff,
            as: "ServiceProvider",
      
            attributes: [
              "id",
              "position"
            ],
      
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
        ],
      
        order: [
          ["createdAt", "DESC"]
        ]
      })

    return res.status(200).json({
      success: true,
      sales,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = getSalesReport