const pool = require("../config/pg");

const Images = {
    // get image slide (banner)
    getUrlImageSlide: async () => {
        try {
            const result = await pool.query("SELECT * FROM slider");
            return result.rows;
        } catch (err) {
            throw new Error(`Error Fetching Slider: ${err.message}`);
        }
    },

    // get image
    getImageShop: async () => {
        try {
            const result = await pool.query("SELECT * FROM images_shop");
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching Image shop: ${err.message}`);
        }
    },

    // admin create image by image shop or banner
    createImage: async (imageArr, bannerArr) => {
        try {
            const result = [];

            if (imageArr && Array.isArray(imageArr)) {
                for (let i = 0; i < imageArr.length; i++) {
                    const image = imageArr[i];
                    const query = await pool.query(
                        `INSERT INTO images_shop (image_url) VALUES ($1) RETURNING *`,
                        [image]
                    );
                    result.push(query.rows[0]);
                }
            }

            if (bannerArr && Array.isArray(bannerArr)) {
                for (let i = 0; i < bannerArr.length; i++) {
                    const banner = bannerArr[i];
                    const query = await pool.query(
                        `INSERT INTO slider (banner_url) VALUES ($1) RETURNING *`,
                        [banner]
                    );
                    result.push(query.rows[0]);
                }
            }

            return result;
        } catch (err) {
            throw new Error(`Error model create image shop: ${err.message}`);
        }
    },

    // delete image by imageId or bannerId
    deleteImage: async (imageId, bannerId) => {
        const id = imageId || bannerId;
        const table = imageId ? "images_shop" : "slider";
        try {
            const query = await pool.query(
                `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
                [id]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error model delete image shop: ${err.message}`);
        }
    },
};

module.exports = Images;
