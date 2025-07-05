const express = require("express");
const router = express.Router();
const brandRouter = require("../route/brandRoute");
const imagesRouter = require("../route/imageRoute");
const productsRouter = require("../route/productsRoute");
const blogRouter = require("../route/blogRoute");
const orderRouter = require("../route/orderRoute");
router.use("/brands", brandRouter);
router.use("/images", imagesRouter);
router.use("/products", productsRouter);
router.use("/blogs", blogRouter);
router.use("/order", orderRouter);

module.exports = router;
