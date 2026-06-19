const Commission = require('../models/Commission')
const Staff = require('../models/Staff')
const User = require('../models/User')
const Sale = require('../models/Sale')

exports.getCommissions = async (req, res) => {
  try {
    const commissions =
      await Commission.findAll({
        include: [
          {
            model: Staff,
            include: [
              {
                model: User,
                attributes: [
                  'id',
                  'fullname',
                ],
              },
            ],
          },
          {
            model: Sale,
          },
        ],
        order: [
          ['createdAt', 'DESC'],
        ],
      })

    return res.status(200).json({
      success: true,
      commissions,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.markAsPaid = async (
  req,
  res,
) => {
  try {
    const commission =
      await Commission.findByPk(
        req.params.id,
      )

    if (!commission) {
      return res.status(404).json({
        success: false,
        message:
          'Commission not found',
      })
    }

    await commission.update({
      status: 'paid',
      paidAt: new Date(),
    })

    return res.status(200).json({
      success: true,
      message:
        'Commission paid successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}