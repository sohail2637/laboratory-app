const express = require("express");
const app = express();
const purchase = require("../controller/purchase");

// Add Purchase
app.post("/add", purchase.addPurchase);

// Get All Purchase Data
app.get("/get/:userID", purchase.getPurchaseData);

app.get("/get/:userID/totalpurchaseamount", purchase.getTotalPurchaseAmount);

module.exports = app;

// ${GlobalApiState.DEV_BASE_LIVE}/api/purchase/add POST
// ${GlobalApiState.DEV_BASE_LIVE}/api/purchase/get GET
