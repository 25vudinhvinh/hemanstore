const poll = require("../config/pg");

const Images = {
    getUrlImageSlide: async () => {
        try {
            const result = await poll.query("SELECT * FROM slider");
            return result.rows;
        } catch (err) {
            throw new Error(`Error Fetching Slider: ${err.message}`);
        }
    },
    getImageShop: async () => {
        try {
            const result = await poll.query("SELECT * FROM images_shop");
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching Image shop: ${err.message}`);
        }
    },
};

module.exports = Images;
