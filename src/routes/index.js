const express = require("express");
const router = express.Router();
const brandRouter = require("../route/brandRoute");
const imagesRouter = require("../route/imageRoute");
const productsRouter = require("../route/productsRoute");
const blogRouter = require("../route/blogRoute");
router.use("/brands", brandRouter);
router.use("/images", imagesRouter);
router.use("/products", productsRouter);
router.use("/blogs", blogRouter);

module.exports = router;
