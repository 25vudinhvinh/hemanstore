const Blogs = require("../models/blogsModel");
const blogsModel = require("../models/blogsModel");
const { body, validationResult } = require("express-validator");

// sget all blog
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await blogsModel.getBlogs();
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

// get blog theo id
exports.getBlogId = async (req, res) => {
    try {
        const { blogId } = req.body;
        const result = await blogsModel.getBlogId(blogId);
        res.status(200).json({
            success: false,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// create comment
exports.createComment = [
    body("blogId").notEmpty().withMessage("blogId là bắt buộc"),
    body("comment").notEmpty().withMessage("Bình luận là bắt buộc"),
    body("name").notEmpty().withMessage("Tên là bắt buộc"),
    body("email")
        .notEmpty()
        .withMessage("Email là bắt buộc")
        .bail()
        .isEmail()
        .withMessage("Email không hợp lệ"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { blogId, name, email, comment, webUrl = null } = req.body;
            const result = await blogsModel.createComment(
                blogId,
                name,
                email,
                comment,
                webUrl
            );
            res.status(200).json({
                success: true,
                message: "Gửi bình luận thành công.",
                commentId: result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
];

// get comment
exports.getComment = async (req, res) => {
    try {
        const { blogId } = req.body;
        const result = await blogsModel.getComment(blogId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// get new blog
exports.getBlogNew = async (req, res) => {
    try {
        const { blogId } = req.body;
        const result = await blogsModel.getBlogNew(blogId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// create blog
exports.createBlog = [
    body("title").notEmpty().withMessage("Tiêu đề không được để trống."),
    body("body").notEmpty().withMessage("Nội dung không được để trống."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, imageUrl = null, body } = req.body;

            const createBlog = await Blogs.createBlog(title, imageUrl, body);
            res.status(200).json({
                success: true,
                message: "Tạo bài viết thành công.",
                blog: createBlog,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
];

// delelte blog
exports.deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const deleteBlog = Blogs.deleteBlog(blogId);
        res.status(200).json({
            success: true,
            message: "Xoá bài viết thành công.",
            data: deleteBlog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
