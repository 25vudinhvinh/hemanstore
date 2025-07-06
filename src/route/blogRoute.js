const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogsController");

router.get("/", blogController.getBlogs);
router.post("/create", blogController.createComment);
router.post("/get-comment", blogController.getComment);
module.exports = router;
