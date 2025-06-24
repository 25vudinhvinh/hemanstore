const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

// Cấu hình multer để lưu file vào thư mục uploads/avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/avatars"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("avatar"), authController.register);
router.post("/login", authController.login);

module.exports = router;
