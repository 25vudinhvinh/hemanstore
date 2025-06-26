const Products = require("../models/productsModel");
exports.getAllSize = async (req, res) => {
    try {
        const result = await Products.getAllSize();
        res.status(200).json({
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getHotProducts = async (req, res) => {
    try {
        const result = await Products.getHotProducts();
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

exports.getAdidas = async (req, res) => {
    try {
        const result = await Products.getAdidas();
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

exports.getNike = async (req, res) => {
    try {
        const result = await Products.getNike();
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

exports.getMLB = async (req, res) => {
    try {
        const result = await Products.getMLB();
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

exports.getNEWBALANCE = async (req, res) => {
    try {
        const result = await Products.getNEWBALANCE();
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

exports.getDetail = async (req, res) => {
    const productId = req.body.product_id;
    try {
        const detailProcuct = await Products.getDetail(productId);
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
    const { brandId, productId } = req.body;
    if (!brandId || !productId) {
        res.status(404).json("Invalid brand_id Or product_id");
    }
    try {
        const result = await Products.getSameProduct(brandId, productId);
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

exports.getBigSize = async (req, res) => {
    const { page = 1 } = req.body;
    const pageNum = parseInt(page);
    const limitProduct = 12;
    const offset = pageNum - 1;
    try {
        const count = await Products.CountBigsize();
        const rowCount = count[0].total_count;
        const pagesTotal = Math.ceil(rowCount / limitProduct);

        const result = await Products.getBigSize(limitProduct, offset);
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number",
            });
        }

        res.status(200).json({
            pagesTotal: pagesTotal,
            pageCurrent: pageNum,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getProductsCategory = async (req, res) => {
    try {
        let { sizes, brandId, page = 1 } = req.body;
        const limitProduct = 12;
        brandId = parseInt(brandId);
        if (isNaN(limitProduct) && isNaN(page)) {
            page = parseInt(page);
        }
        if (isNaN(brandId)) {
            res.status(400).json({
                success: false,
                message: "Invalid value brandId",
            });
        }
        if (!Array.isArray(sizes) || sizes.length == 0) {
            res.status(400).json({
                success: false,
                message: "sizes not is Array and not null",
            });
        }
        const countProduct = await Products.countProductCategory(
            brandId,
            sizes
        );
        const totalPage = Math.ceil(countProduct[0].total_count / limitProduct);
        const offSet = parseInt(page) - 1;
        const result = await Products.getProductsCategory(
            brandId,
            sizes,
            limitProduct,
            offSet
        );

        res.status(200).json({
            countProduct: countProduct[0].total_count,
            totalPage: totalPage,
            pageCurrent: page,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
