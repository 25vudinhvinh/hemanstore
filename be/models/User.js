const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
    create: async (username, password, avatar_url = null) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password, avatar_url) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword, avatar_url]
        );
        return result.rows[0];
    },
    findByUsername: async (username) => {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        return result.rows[0];
    },
};

module.exports = User;
