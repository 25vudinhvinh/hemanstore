const Products = require("../models/productsModel");

exports.getHotProducts = async (req, res) => {
    try {
        const hotProducts = await Products.getHotProducts();
        res.status(200).json({
            success: true,
            data: hotProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
