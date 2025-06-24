// routes/dataRoutes.js
const express = require("express");
const router = express.Router();
const {
    getLocationsAlls,
    getNearbyLocations,
} = require("../models/LocationDetail");

router.post("/locations", getLocationsAlls);
router.post("/locations/nearby", getNearbyLocations);
module.exports = router;
