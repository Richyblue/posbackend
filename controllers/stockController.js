const Product =
require("../models/Product");

const StockMovement =
require("../models/StockMovement");
const User =
require("../models/User");

exports.addStock =
async (req,res)=>{

 try {

  const {
   productId,
   quantity,
   note
  } = req.body;

  const product =
   await Product.findByPk(
    productId
   );

  if(!product){

   return res.status(404)
   .json({
    success:false,
    message:
    "Product not found"
   });

  }

  const previousStock =
   product.quantity;

  product.quantity +=
   Number(quantity);

  await product.save();

  await StockMovement
  .create({

   ProductId:
   product.id,

   UserId:
   req.user.id,

   movementType:
   "purchase",

   quantity,

   previousStock,

   currentStock:
   product.quantity,

   note

  });

  return res.status(200)
  .json({

   success:true,

   message:
   "Stock added successfully",

   product

  });

 } catch(error){

  console.error(error);

  return res.status(500)
  .json({

   success:false,

   message:
   "Server error"

  });

 }

};

exports.adjustStock =
async (req,res)=>{

 try {

  const {
   productId,
   quantity,
   note
  } = req.body;

  const product =
   await Product.findByPk(
    productId
   );

  if(!product){

   return res.status(404)
   .json({
    success:false,
    message:
    "Product not found"
   });

  }

  const previousStock =
   product.quantity;

  product.quantity =
   Number(quantity);

  await product.save();

  await StockMovement
  .create({

   ProductId:
   product.id,

   UserId:
   req.user.id,

   movementType:
   "adjustment",

   quantity,

   previousStock,

   currentStock:
   quantity,

   note

  });

  return res.status(200)
  .json({

   success:true,

   message:
   "Stock adjusted",

   product

  });

 } catch(error){

  console.error(error);

  return res.status(500)
  .json({
   success:false,
   message:
   "Server error"
  });

 }

};

exports.damageStock =
async (req,res)=>{

 try {

  const {
   productId,
   quantity,
   note
  } = req.body;

  const product =
   await Product.findByPk(
    productId
   );

  if(!product){

   return res.status(404)
   .json({
    success:false,
    message:
    "Product not found"
   });

  }

  if(
   product.quantity <
   quantity
  ){

   return res.status(400)
   .json({

    success:false,

    message:
    "Insufficient stock"

   });

  }

  const previousStock =
   product.quantity;

  product.quantity -=
   Number(quantity);

  await product.save();

  await StockMovement
  .create({

   ProductId:
   product.id,

   UserId:
   req.user.id,

   movementType:
   "damage",

   quantity,

   previousStock,

   currentStock:
   product.quantity,

   note

  });

  return res.status(200)
  .json({

   success:true,

   message:
   "Damage recorded"

  });

 } catch(error){

  console.error(error);

  return res.status(500)
  .json({
   success:false,
   message:
   "Server error"
  });

 }

};




exports.getStockHistory =
async (req,res)=>{

 try {

  const history =
  await StockMovement
  .findAll({

   where:{
    ProductId:
    req.params.productId
   },

   include:[
    Product,
    User
   ],

   order:[
    [
     "createdAt",
     "DESC"
    ]
   ]

  });

  return res.status(200)
  .json({

   success:true,

   history

  });

 } catch(error){

  console.error(error);

  return res.status(500)
  .json({
   success:false,
   message:
   "Server error"
  });

 }

};