const pool = require("../config/pg");

const Blogs = {
    // get all blog
    getBlogs: async () => {
        try {
            const query = await pool.query(`SELECT * FROM blogs`);
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching blogs: ${err.message}`);
        }
    },

    // get blog by id
    getBlogId: async (blogId) => {
        try {
            const query = await pool.query(
                `SELECT * FROM blogs WHERE id = $1`,
                [blogId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error get blog id: ${err.message}`);
        }
    },

    // create commet by blogId
    createComment: async (blogId, name, email, webUrl, comment) => {
        try {
            const query = await pool.query(
                `
                INSERT INTO review_blog(blog_id, name, email, web_url, comment)
                VALUES ($1, $2, $3, $4, $5) RETURNING *
                `,
                [blogId, name, email, comment, webUrl]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error model create comment: ${err.message}`);
        }
    },

    // get comment blog by blogId
    getComment: async (blogId) => {
        try {
            const query = await pool.query(
                `
                SELECT * FROM review_blog
                WHERE blog_id = $1
                `,
                [blogId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error get comment: ${err.message}`);
        }
    },

    // get blog new by created
    getBlogNew: async (blogId) => {
        try {
            const query = await pool.query(
                `SELECT id, title
                FROM blogs 
                WHERE id != $1
                ORDER BY created
                LIMIT 5;`,
                [blogId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error get blog new: ${err.message}`);
        }
    },

    // admin create blog
    createBlog: async (title, imageUrl, body) => {
        try {
            const query = await pool.query(
                `INSERT INTO blogs (title, image_url, body) 
                VALUES ($1, $2, $3) 
                RETURNING *`,
                [title, imageUrl, body]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error model create blog: ${err.message}`);
        }
    },

    // admin delete blog
    deleteBlog: async (blogId) => {
        try {
            const query = await pool.query(
                `DELETE FROM blogs WHERE id = $1 RETURNING *`,
                [blogId]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error model delete blog: ${err.message}`);
        }
    },
};

module.exports = Blogs;
