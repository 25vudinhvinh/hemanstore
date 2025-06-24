const pool = require("../config/database");

const Category = {
    getCategory: async (req, res) => {
        try {
            const categories = await pool.query(
                "SELECT category_id, name FROM categories where parent_id = 1"
            );
            res.json(categories.rows);
        } catch (error) {
            res.status(500).json({ error: "Có lỗi xảy ra" });
        }
    },
};

module.exports = Category;
