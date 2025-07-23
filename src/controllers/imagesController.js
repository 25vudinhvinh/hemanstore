const Images = require("../models/imageModel");

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

exports.createImage = [
    async (req, res) => {
        try {
            const { imageUrl, bannerUrl } = req.body;

            if (!imageUrl && !bannerUrl) {
                return res.status(400).json({
                    success: false,
                    message: "Ảnh không được để trống.",
                });
            }

            const imageArr = [];

            if (imageUrl) {
                const createdImage = await Images.createImage(imageUrl);
                imageArr.push(createdImage);
            }

            if (bannerUrl) {
                const createdBanner = await Images.createImage(bannerUrl);
                imageArr.push(createdBanner);
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

exports.deleteImage = async (req, res) => {
    try {
        const { imageId, bannerId } = req.body;
        let imageDeleteArr = [];
        if (imageId) {
            const deleteImageShop = await Images.deleteImage(imageId);
            imageDeleteArr.push(deleteImageShop);
        } else if (bannerId) {
            const deleteImageShop = await Images.deleteImage(bannerId);
            imageDeleteArr.push(deleteImageShop);
        }
        res.status(200).json({
            success: true,
            message: "Xoá ảnh thành công.",
            imageDeleteArr,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
