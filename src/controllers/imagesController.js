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
