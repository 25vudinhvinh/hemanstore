const Blogs = require("../models/blogsModel");

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.getBlogs();
        res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
