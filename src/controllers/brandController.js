const Brand = require("../models/brandModel");

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.getAll();
        res.status(200).json({
            sucess: true,
            data: brands,
        });
    } catch (err) {
        res.status(500).json({
            sucess: false,
            message: err.message,
        });
    }
};
