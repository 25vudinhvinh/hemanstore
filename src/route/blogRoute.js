const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogsController");

router.get("/", blogController.getBlogs);

module.exports = router;
