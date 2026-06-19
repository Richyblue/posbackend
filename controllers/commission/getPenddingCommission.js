const Commission =
require("../../models/Commission");

const getPendingCommissions =
async (req, res) => {

    try {

        const commissions =
            await Commission.findAll({
                where: {
                    status:
                        "pending"
                }
            });

        const totalPending =
            commissions.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.commissionAmount
                    ),
                0
            );

        return res.status(200).json({
            success: true,
            totalPending,
            commissions
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};

module.exports =
    getPendingCommissions;