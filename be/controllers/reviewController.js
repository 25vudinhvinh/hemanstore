const {
    createReview,
    checkLocationExists,
    checkUserExists,
    getReviewsByLocation,
} = require("../models/review");
const jwt = require("jsonwebtoken");

const createReviewHandler = async (req, res) => {
    const { location_id, rating, comment } = req.body;
    const images = req.files;

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Thiếu token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;

        if (!location_id || !rating || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ error: "Thiếu hoặc sai thông tin bắt buộc" });
        }
        if (!(await checkLocationExists(location_id))) {
            return res.status(404).json({ error: "Địa điểm không tồn tại" });
        }
        if (!(await checkUserExists(user_id))) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        const image_urls = images.map(
            (file) => `/uploads/reviews/${file.filename}`
        );
        const review = await createReview(
            location_id,
            user_id,
            rating,
            comment,
            image_urls
        );

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
};

const getReviewsHandler = async (req, res) => {
    const { location_id } = req.query;

    try {
        if (!location_id) {
            return res.status(400).json({ error: "Thiếu location_id" });
        }
        if (!(await checkLocationExists(location_id))) {
            return res.status(404).json({ error: "Địa điểm không tồn tại" });
        }

        const reviews = await getReviewsByLocation(location_id);
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
};

module.exports = { createReviewHandler, getReviewsHandler };
