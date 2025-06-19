const express = require("express");
const router = express.Router();
const brandRouter = require("../route/brandRoute");

router.use("/brands", brandRouter);

module.exports = router;
