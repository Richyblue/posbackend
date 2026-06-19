const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
    "/stock/add",
    authMiddleware,
    adminMiddleware,
    addStock
   );
   
   router.post(
    "/stock/adjust",
    authMiddleware,
    adminMiddleware,
    adjustStock
   );
   
   router.post(
    "/stock/damage",
    authMiddleware,
    adminMiddleware,
    damageStock
   );
   
   router.get(
    "/stock/history/:productId",
    authMiddleware,
    getStockHistory
   );

   module.exports=router;