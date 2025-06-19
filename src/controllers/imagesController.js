const Images = require("../models/imageModel");

exports.getSlider = async (req, res) => {
    try {
        const slider = await Images.getUrlImageSlide();
        res.status(200).json({
            sucess: true,
            data: slider,
        });
    } catch (err) {
        res.status(500).json({
            sucess: false,
            message: err.message,
        });
    }
};
