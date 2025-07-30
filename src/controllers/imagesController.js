const Images = require("../models/imageModel");

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
    async (req, res) => {
        try {
            const { imageArr, bannerArr } = req.body;

            if (!imageArr && !bannerArr) {
                return res.status(400).json({
                    success: false,
                    message: "Ảnh không được để trống.",
                });
            }
            const result = [];
            if (Array.isArray(imageArr) || Array.isArray(bannerArr)) {
                if (imageArr) {
                    const createdImage = await Images.createImage(imageArr);
                    result.push(createdImage);
                }

                if (bannerArr) {
                    const createdBanner = await Images.createImage(bannerArr);
                    result.push(createdBanner);
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: "imageArr hoặc bannerArr phải là một mảng.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Thêm ảnh mới thành công.",
                data: imageArr,
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
