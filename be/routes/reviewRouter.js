const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    createReviewHandler,
    getReviewsHandler,
} = require("../controllers/reviewController");

const router = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/reviews/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file JPG hoặc PNG!"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Route tạo đánh giá
router.post("/", upload.array("images", 5), createReviewHandler);
// Route lấy danh sách đánh giá
router.get("/", getReviewsHandler);

module.exports = router;
