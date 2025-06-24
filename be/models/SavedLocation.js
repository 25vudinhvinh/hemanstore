const pool = require("../config/database");

const SavedLocation = {
    getList: async (req, res) => {
        const userId = req.body.userId;
        try {
            const result = await pool.query(
                "SELECT name FROM lists WHERE user_id = $1",
                [userId]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = SavedLocation;
