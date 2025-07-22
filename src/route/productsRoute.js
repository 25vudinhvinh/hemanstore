const express = require("express");
const router = express.Router();
const Products = require("../controllers/productsController");

router.post("/size", Products.getAllSize);
router.get("/hot", Products.getHotProducts);
router.get("/adidas-limit", Products.getAdidas);
router.get("/nike-limit", Products.getNike);
router.get("/mlb-limit", Products.getMLB);
router.get("/newbalance-limit", Products.getNEWBALANCE);
router.post("/detail", Products.getDetail);
router.post("/same", Products.getSameProduct);
router.post("/category", Products.getProductsCategory);
router.post("/search", Products.searchProduct);
router.post("/create", Products.createProduct);
router.post("/delete", Products.deleteProduct);
module.exports = router;
