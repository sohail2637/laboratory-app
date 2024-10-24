const express = require("express");
const app = express();
const test = require("../controller/tests")

app.post("/add-test", test.addTest );
app.get("/listing_test/:userId",test.getAllTest );
app.delete("/delete_test/:id",test.deleteSelectedTest );
app.get("/edit_test/:id",test.editTest);
app.put("/update_test/:id",test.updateTest );
  

module.exports = app;
