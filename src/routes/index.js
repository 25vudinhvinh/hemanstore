const express = require("express");
const router = express.Router();
const brandRouter = require("../route/brandRoute");
const imagesController = require("../route/imageRoute");

router.use("/brands", brandRouter);
router.use("/images", imagesController);

module.exports = router;
