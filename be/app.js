const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRouter");
const locationDetail = require("./routes/locationDetailRouter");
const savedRouter = require("./routes/savedRouter");
const multer = require("multer");
const path = require("path");

const reviewRoutes = require("./routes/reviewRouter");
const categories = require("./models/Category");

dotenv.config();
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// api url
app.use("/api/auth", authRouter);
app.get("/category", categories.getCategory);
app.use("/api", locationDetail);
app.use("/api/reviews", reviewRoutes);
app.use("/saved", savedRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
