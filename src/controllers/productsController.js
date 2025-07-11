const Products = require("../models/productsModel");
exports.getAllSize = async (req, res) => {
    try {
        const { brandId } = req.body;
        const result = await Products.getAllSize(brandId);
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

exports.searchProduct = async (req, res) => {
    const { search } = req.body;

    if (!search || search.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Search term is required",
        });
    }

    const searchTerm = `%${search}%`;

    try {
        const result = await Products.searchProduct(searchTerm);

        if (result.length === 0) {
            return res.status(404).json({
                success: true,
                message: "Không có sản phẩm nào",
            });
        }

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

exports.getProductsCategory = async (req, res) => {
    try {
        let {
            sizes,
            brandId,
            page = 1,
            minPrice,
            maxPrice,
            subBrandId,
        } = req.body;
        const limitProduct = 12;

        page = parseInt(page);
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid number page",
            });
        }

        if (brandId) {
            brandId = parseInt(brandId);
            if (isNaN(brandId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid number brandId",
                });
            }
        }
        if (subBrandId) {
            subBrandId = parseInt(subBrandId);
        }

        if (sizes) {
            if (!Array.isArray(sizes) || sizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "sizes must be a array and not null",
                });
            }
            sizes = sizes.map(Number);
            if (!sizes.every((size) => !isNaN(size))) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid number size",
                });
            }
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            minPrice = Number(minPrice);
            maxPrice = Number(maxPrice);
            if (isNaN(minPrice) || isNaN(maxPrice)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid number price",
                });
            }
        } else {
            minPrice = null;
            maxPrice = null;
        }

        const countProduct = await Products.countProductCategory(
            brandId,
            subBrandId,
            sizes,
            minPrice,
            maxPrice
        );
        const totalPage = Math.ceil(countProduct[0].total_count / limitProduct);
        const offSet = (page - 1) * limitProduct;

        const result = await Products.getProductsCategory(
            brandId,
            subBrandId,
            sizes,
            limitProduct,
            offSet,
            minPrice,
            maxPrice
        );

        res.status(200).json({
            countProduct: countProduct[0].total_count,
            limitProduct: limitProduct,
            offSet: offSet,
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
