const pool = require("../config/pg");

const Images = {
    getUrlImageSlide: async () => {
        try {
            const result = await pool.query("SELECT * FROM slider");
            return result.rows;
        } catch (err) {
            throw new Error(`Error Fetching Slider: ${err.message}`);
        }
    },
    getImageShop: async () => {
        try {
            const result = await pool.query("SELECT * FROM images_shop");
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching Image shop: ${err.message}`);
        }
    },

    createImage: async (imageUrl, bannerUrl) => {
        try {
            const query = await pool.query(
                `INSERT INTO ${
                    imageUrl ? "images_shop" : "slider"
                }  (image_url)  
                VALUES ($1)
                RETURNING *`,
                [imageUrl ? imageUrl : bannerUrl]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error model create image shop: ${err.message}`);
        }
    },

    deleteImage: async (id) => {
        try {
            if (id) {
                const query = await pool.query(
                    `DELETE FROM images_shop WHERE id = $1 RETURNING *`,
                    [id]
                );
                return query.rows[0];
            }
        } catch (err) {
            throw new Error(`Error model delete image shop: ${err.message}`);
        }
    },
};

module.exports = Images;
