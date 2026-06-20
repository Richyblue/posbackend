const Customer = require('../models/Customer')

exports.createCustomer = async (req, res) => {
  try {
    const { fullname, phone, email } = req.body

    const customer = await Customer.create({
      fullname,
      phone,
      email,
    })

    return res.status(201).json({
      success: true,
      customer,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      success: true,
      customers,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    return res.status(200).json({
      success: true,
      customer,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    await customer.update(req.body)

    return res.status(200).json({
      success: true,
      customer,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    await customer.destroy()

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}