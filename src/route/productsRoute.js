const express = require("express");
const router = express.Router();
const Products = require("../controllers/productsController");

router.get("/all-size", Products.getAllSize);
router.get("/hot", Products.getHotProducts);
router.get("/adidas-limit", Products.getAdidas);
router.get("/nike-limit", Products.getNike);
router.get("/mlb-limit", Products.getMLB);
router.get("/newbalance-limit", Products.getNEWBALANCE);
router.post("/detail", Products.getDetail);
router.post("/same", Products.getSameProduct);
router.post("/big-size", Products.getBigSize);
router.post("/category", Products.getProductsCategory);
router.post("/search", Products.findProduct);
module.exports = router;
