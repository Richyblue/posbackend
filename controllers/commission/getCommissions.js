const Commission = require("../../models/Commission");
const Staff = require("../../models/Staff");

const getCommissions = async (
    req,
    res
) => {
    try {

        const commissions =
            await Commission.findAll({
                include: [
                    {
                        model: Staff
                    }
                ],
                order: [
                    [
                        "createdAt",
                        "DESC"
                    ]
                ]
            });

        return res.status(200).json({
            success: true,
            count:
                commissions.length,
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
    getCommissions;