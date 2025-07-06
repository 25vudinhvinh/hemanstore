const blogsModel = require("../models/blogsModel");
const { body, validationResult } = require("express-validator");
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

exports.createComment = [
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
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
];

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
