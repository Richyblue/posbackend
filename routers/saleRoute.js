const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorize =require("../middlewares/roleMiddleware");
const slaesController =require("../controllers/saleController");



router.post(
    "/sales",
    authMiddleware,
    authorize(
        "admin",
        "manager",
        "cashier",
        "staff"
    ),
    slaesController.createSale
);

router.get(
    "/sales",
    authMiddleware,
    authorize(
        "admin",
        "manager"
    ),
    slaesController.approveSale
);



module.exports = router;