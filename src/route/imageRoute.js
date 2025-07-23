const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imagesController");

router.get("/banner", imagesController.getSlider);
router.get("/shop", imagesController.getImageShop);
router.post("/create", imagesController.createImage);
router.post("/delete", imagesController.deleteImage);
module.exports = router;
