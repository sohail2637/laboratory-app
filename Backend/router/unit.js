const express = require("express");
const app = express();
const unit = require("../controller/unit")

app.post("/add-unit", unit.addUnit );
app.get("/listing_unit/:userId",unit.getAllUnit );
app.delete("/delete_unit/:id",unit.deleteSelectedUnit );
app.get("/edit_unit/:id",unit.editUnit);
app.put("/update_unit/:id",unit.updateUnit );
  

module.exports = app;
