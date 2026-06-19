const Product = require("../models/Product");
const { Op } = require("sequelize");

const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      costPrice,
      sellingPrice,
      quantity,
      reorderLevel,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,

        message: "Product name is required",
      });
    }

    const existing = await Product.findOne({
      where: { sku },
    });

    if (existing) {
      return res.status(400).json({
        success: false,

        message: "SKU already exists",
      });
    }

    let image = null;

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        "salon-products",

        req.file.buffer
      );

      image = uploaded.secure_url;
    }

    const product = await Product.create({
      name,

      sku,

      barcode,

      costPrice,

      sellingPrice,

      quantity,

      reorderLevel,

      image,

      status,
    });

    return res.status(201).json({
      success: true,

      message: "Product created successfully",

      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message || "Server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      ...req.body,

      image: req.file?.path || product.image,
    });

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteProduct =
async (
  req,
  res
) => {

  try {

    const product =
      await Product.findByPk(
        req.params.id
      )

    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      })

    }

    await product.destroy()

    return res.status(200).json({

      success: true,

      message:
        "Product moved to recycle bin"

    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    })

  }

}

exports.searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.lowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        quantity: {
          [Op.lte]: 5,
        },
      },
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        barcode: req.params.barcode,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.getDeletedProducts =
async (
  req,
  res
) => {

  try {

    const products =
      await Product.findAll({

        paranoid: false,

        where: {

          deletedAt: {

            [Op.ne]:
              null

          }

        }

      })

    return res.status(200).json({

      success: true,

      products

    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    })

  }

}

exports.restoreProduct =
async (
  req,
  res
) => {

  try {

    const product =
      await Product.findByPk(

        req.params.id,

        {
          paranoid: false
        }

      )

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      })

    }

    await product.restore()

    return res.status(200).json({

      success: true,

      message:
        "Product restored successfully"

    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    })

  }

}

exports.permanentDeleteProduct =
async (
  req,
  res
) => {

  try {

    const product =
      await Product.findByPk(

        req.params.id,

        {
          paranoid: false
        }

      )

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      })

    }

    await product.destroy({
      force: true
    })

    return res.status(200).json({

      success: true,

      message:
        "Product permanently deleted"

    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    })

  }

}
