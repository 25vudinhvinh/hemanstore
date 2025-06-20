const pool = require("../config/pg");

const Products = {
    getHotProducts: async () => {
        try {
            const result = await pool.query(
                "SELECT * FROM products WHERE views IS NOT NULL ORDER BY views DESC LIMIT 8"
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching hot products: ${err.message}`);
        }
    },
};

module.exports = Products;
