const Commission =
require("../../models/Commission");

const getStaffCommissions =
async (req, res) => {

    try {

        const commissions =
            await Commission.findAll({
                where: {
                    StaffId:
                        req.params.staffId
                }
            });

        const pending =
            commissions
                .filter(
                    c =>
                        c.status ===
                        "pending"
                )
                .reduce(
                    (
                        sum,
                        c
                    ) =>
                        sum +
                        Number(
                            c.commissionAmount
                        ),
                    0
                );

        const paid =
            commissions
                .filter(
                    c =>
                        c.status ===
                        "paid"
                )
                .reduce(
                    (
                        sum,
                        c
                    ) =>
                        sum +
                        Number(
                            c.commissionAmount
                        ),
                    0
                );

        return res.status(200).json({
            success: true,
            pending,
            paid,
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
    getStaffCommissions;