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
exports.findProduct = async (req, res) => {
    const { search } = req.body;

    if (!search || search.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Search term is required",
        });
    }

    const searchTerm = `%${search}%`;

    try {
        const result = await Products.findProduct(searchTerm);

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

exports.getBigSize = async (req, res) => {
    let { page = 1, sizes } = req.body;
    const pageNum = parseInt(page);
    const limitProduct = 12;
    const offset = (pageNum - 1) * limitProduct;
    try {
        const count = await Products.CountBigsize(sizes);
        const countProduct = count[0].total_count;
        const pagesTotal = Math.ceil(countProduct / limitProduct);

        if (sizes) {
            if (!Array.isArray(sizes)) {
                res.status(400).json({
                    success: false,
                    message: "Size is a array and not null",
                });
            }
        }

        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number",
            });
        }

        const result = await Products.getBigSize(limitProduct, offset, sizes);

        res.status(200).json({
            countProduct: countProduct,
            limit: limitProduct,
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
        let { sizes, brandId, page = 1, priceRange } = req.body;
        const limitProduct = 12;

        page = parseInt(page);
        if (isNaN(page)) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number",
            });
        }

        if (brandId) {
            brandId = parseInt(brandId);
            if (isNaN(brandId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid value for brandId",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "brandId is required",
            });
        }

        if (sizes) {
            if (!Array.isArray(sizes) || sizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "sizes must be a non-empty array",
                });
            }
        }

        let minPrice = null;
        let maxPrice = null;
        if (priceRange) {
            if (!["0-500000", "500000-1000000"].includes(priceRange)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid priceRange. Must be '0-500000' or '500000-1000000'",
                });
            }

            [minPrice, maxPrice] = priceRange
                .split("-")
                .map((num) => Number(num) / 1000);
        }

        const countProduct = await Products.countProductCategory(
            brandId,
            sizes,
            minPrice,
            maxPrice
        );
        const totalPage = Math.ceil(countProduct[0].total_count / limitProduct);
        const offSet = (page - 1) * limitProduct;

        const result = await Products.getProductsCategory(
            brandId,
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
exports.getProductSubBrandId = async (req, res) => {
    try {
        const { subBrandId, sizes, page = 1 } = req.body;
        const limitProduct = 12;
        const offSet = (page - 1) * limitProduct;
        if (isNaN(subBrandId)) {
            return res.status(400).json({
                success: false,
                message: "subBrandId must be a number",
            });
        }
        if (sizes) {
            if (!Array.isArray(sizes) || sizes.length < 1) {
                return res.status(400).json({
                    success: false,
                    message: "sizes must be a array",
                });
            }
        }

        const countAllProducts = await Products.countSubBrand(
            subBrandId,
            sizes
        );
        const countNum = parseInt(countAllProducts[0].count);
        const totalPage = Math.ceil(countNum / limitProduct);
        const result = await Products.getProductsSubBrandId(
            subBrandId,
            sizes,
            limitProduct,
            offSet
        );

        res.status(200).json({
            countAllProduct: countNum,
            limitProduct: limitProduct,
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
