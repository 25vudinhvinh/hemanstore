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

exports.getAdidas = async (req, res) => {
    try {
        const adidasProducts = await Products.getAdidas();
        res.status(200).json({
            success: true,
            data: adidasProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getNike = async (req, res) => {
    try {
        const adidasProducts = await Products.getNike();
        res.status(200).json({
            success: true,
            data: adidasProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getMLB = async (req, res) => {
    try {
        const adidasProducts = await Products.getMLB();
        res.status(200).json({
            success: true,
            data: adidasProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getNEWBALANCE = async (req, res) => {
    try {
        const adidasProducts = await Products.getNEWBALANCE();
        res.status(200).json({
            success: true,
            data: adidasProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getDetail = async (req, res) => {
    const product_id = req.body.product_id;
    try {
        const detailProcuct = await Products.getDetail(product_id);
        res.status(200).json({
            success: true,
            data: detailProcuct,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getSameProduct = async (req, res) => {
    const brand_id = req.body.brand_id;
    const product_id = req.body.product_id;
    if (!brand_id || !product_id) {
        res.status(404).json("Invalid brand_id Or product_id");
    }
    try {
        const result = await Products.getSameProduct(brand_id, product_id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
