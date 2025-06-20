const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imagesController");

router.get("/slider", imagesController.getSlider);
router.get("/shop", imagesController.getImageShop);
module.exports = router;
