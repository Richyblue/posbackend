const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
    try {

        const { title, amount, category } = req.body;

        if (!title || !amount) {
            return res.status(400).json({
                success: false,
                message: "Title and amount are required"
            });
        }

        const expense = await Expense.create({
            title,
            amount,
            category
        });

        return res.status(201).json({
            success: true,
            expense
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


exports.getExpenses = async (req, res) => {
    try {

        const expenses = await Expense.findAll({
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            expenses
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.updateExpense = async (req, res) => {
    try {

        const expense = await Expense.findByPk(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await expense.update(req.body);

        return res.status(200).json({
            success: true,
            expense
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



exports.deleteExpense = async (req, res) => {
    try {

        const expense = await Expense.findByPk(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await expense.destroy();

        return res.status(200).json({
            success: true,
            message: "Expense deleted"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
