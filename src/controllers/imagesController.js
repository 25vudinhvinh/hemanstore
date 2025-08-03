const Images = require("../models/imageModel");
const { body, validationResult } = require("express-validator");

// get banner
exports.getSlider = async (req, res) => {
    try {
        const slider = await Images.getUrlImageSlide();
        res.status(200).json({
            success: true,
            data: slider,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// get image in shop
exports.getImageShop = async (req, res) => {
    try {
        const imageShop = await Images.getImageShop();
        res.status(200).json({
            success: true,
            data: imageShop,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// create image shop or banner
exports.createImage = [
    body("imageArr")
        .optional()
        .notEmpty()
        .withMessage("Ảnh không được để trống.")
        .bail()
        .isArray()
        .withMessage("imageArr phải là một mảng."),
    body("bannerArr")
        .optional()
        .notEmpty()
        .withMessage("Ảnh không được để trống.")
        .bail()
        .isArray()
        .withMessage("bannerArr phải là một mảng."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { imageArr, bannerArr } = req.body;

            if (!imageArr && !bannerArr) {
                return res.status(400).json({
                    success: false,
                    message: "imageArr hoặc bannerArr không được để trống.",
                });
            }

            if (imageArr.length == 0 || bannerArr.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Mảng không được trống.",
                });
            }
            const result = [];

            if (Array.isArray(imageArr)) {
                const createdImage = await Images.createImage(imageArr);
                result.push(createdImage);
            }

            if (Array.isArray(bannerArr)) {
                const createdBanner = await Images.createImage(bannerArr);
                result.push(createdBanner);
            }

            return res.status(200).json({
                success: true,
                message: "Thêm ảnh mới thành công.",
                data: result,
            });
        } catch (err) {
            console.error("Error creating image:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Lỗi server khi thêm ảnh",
            });
        }
    },
];

// delete image shop or banner
exports.deleteImage = async (req, res) => {
    try {
        const { imageId, bannerId } = req.body;

        if (imageId) {
            const deleteImageShop = await Images.deleteImage(imageId);
            res.status(200).json({
                success: true,
                message: "Xoá ảnh thành công.",
                deleteImageShop,
            });
        } else if (bannerId) {
            const deleteBanner = await Images.deleteImage(bannerId);
            res.status(200).json({
                success: true,
                message: "Xoá ảnh thành công.",
                deleteBanner,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "imageId or bannerId is require.",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
