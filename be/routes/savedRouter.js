const express = require("express");
const router = express.Router();
const SavedLocation = require("../models/SavedLocation");

router.post("/getlist", SavedLocation.getList);

module.exports = router;
