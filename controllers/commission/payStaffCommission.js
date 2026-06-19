const Commission =
require("../../models/Commission");

const payStaffCommission =
async (req, res) => {

    try {

        const commissions =
            await Commission.findAll({
                where: {
                    StaffId:
                        req.params.staffId,
                    status:
                        "pending"
                }
            });

        for (
            const commission of commissions
        ) {

            commission.status =
                "paid";

            commission.paidAt =
                new Date();

            await commission.save();
        }

        return res.status(200).json({
            success: true,
            message:
                "Staff commission paid"
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
    payStaffCommission;