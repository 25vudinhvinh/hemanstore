const pool = require("../config/pg");

const Blogs = {
    getBlogs: async () => {
        try {
            const result = await pool.query(`SELECT * FROM blogs`);
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching blogs: ${err.message}`);
        }
    },
};

module.exports = Blogs;
