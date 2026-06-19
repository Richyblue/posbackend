const express = require("express");
const router = express.Router();
const authorize =require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const expenseController=require("../controllers/expenseController");
router.post(
    "/expenses",
    authMiddleware,
    authorize("admin", "manager"),
    expenseController.createExpense
  );

  router.get(
    "/getexpenses",
    authMiddleware,
    authorize("admin", "manager"),
    expenseController.getExpenses
  );

  module.exports=router;