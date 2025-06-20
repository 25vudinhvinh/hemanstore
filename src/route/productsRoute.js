const express = require("express");
const router = express.Router();
const Products = require("../controllers/productsController");

router.get("/hot", Products.getHotProducts);
router.get("/adidas", Products.getAdidas);
router.get("/nike", Products.getNike);
router.get("/mlb", Products.getMLB);
router.get("/newbalance", Products.getNEWBALANCE);

module.exports = router;
