const Commission =
require("../../models/Commission");

const getCommission = async (
    req,
    res
) => {
    try {

        const commission =
            await Commission.findByPk(
                req.params.id
            );

        if (!commission) {
            return res.status(404).json({
                success: false,
                message:
                    "Commission not found"
            });
        }

        return res.status(200).json({
            success: true,
            commission
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
    getCommission;