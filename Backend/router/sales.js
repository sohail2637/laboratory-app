const express = require("express");
const app = express();
const sales = require("../controller/sales");

// Add Sales
app.post("/add", sales.addSales);

// Get All Sales
app.get("/get/:userID", sales.getSalesData);
app.get("/getmonthly", sales.getMonthlySales);


app.get("/get/:userID/totalsaleamount", sales.getTotalSalesAmount);

module.exports = app;



// ${GlobalApiState.DEV_BASE_LIVE}/api/sales/add POST
// ${GlobalApiState.DEV_BASE_LIVE}/api/sales/get GET
