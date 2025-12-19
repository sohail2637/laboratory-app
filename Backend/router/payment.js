const express = require("express");
const router = express.Router();
const { addPayment } = require("../controller/payment");

router.post("/add", addPayment);

module.exports = router;
