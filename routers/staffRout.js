const express = require("express");
const router = express.Router();
const authorize =require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const staffCOntroller=require("../controllers/staffController");
router.post(
    "/staff",
    authMiddleware,
    authorize("admin", "manager", "staff"),
    staffCOntroller.createStaff
  );

  router.get(
    "/staffs",
    authMiddleware,
    authorize("admin", "manager", "cashier"),
    staffCOntroller.getStaff
  );

  module.exports=router;