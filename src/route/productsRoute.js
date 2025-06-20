const express = require("express");
const router = express.Router();
const Products = require("../controllers/productsController");

router.get("/hot", Products.getHotProducts);

module.exports = router;
