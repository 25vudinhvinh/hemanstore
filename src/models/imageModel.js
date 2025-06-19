const poll = require("../config/pg");

const images = {
    getUrlImageSlide: async () => {
        try {
            const result = await poll.query("SELECT * FROM slider");
            return result.rows;
        } catch (err) {
            throw new Error(`Error Fetching Slider: ${err.message}`);
        }
    },
};
