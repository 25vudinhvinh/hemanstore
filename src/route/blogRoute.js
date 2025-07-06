const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogsController");

router.get("/", blogController.getBlogs);
router.post("/create-comment", blogController.createComment);
router.post("/get-comment", blogController.getComment);
router.post("/new", blogController.getBlogNew);
module.exports = router;
