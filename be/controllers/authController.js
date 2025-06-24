const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const avatar_url = req.file
        ? `/uploads/avatars/${req.file.filename}`
        : null;

    if (!username || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ error: "Vui lòng nhập đầy đủ các trường" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Mật khẩu không khớp" });
    }
    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
        }
        const user = await User.create(username, password, avatar_url);
        res.status(201).json({
            message: "Đăng ký thành công",
            user_id: user.user_id,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            error: "Đăng ký thất bại",
            details: error.message,
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }
    try {
        const user = await User.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }
        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        const user_id = user.user_id;
        const avatar_url = user.avatar_url
            ? `http://localhost:5000${user.avatar_url}`
            : "";
        res.json({
            message: "Đăng nhập thành công",
            token,
            avatar_url,
            username,
            user_id,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Đăng nhập thất bại",
            details: error.message,
        });
    }
};
