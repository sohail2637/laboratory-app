const express = require("express");
const app = express();
const test = require("../controller/tests")

app.post("/add-test", test.addTest );
app.get("/listing_test/:userId",test.getAllTest );
app.delete("/delete_test/:id",test.deleteSelectedTest );
app.get("/edit_test/:id",test.editTest);
app.put("/update_test/:id",test.updateTest );
app.put("/group/:id",test.updateGroup );
app.put("/subtest/:id",test.updateSubtest );
app.delete("/subtest/:id",test.deleteSubtest );
app.get("/:groupId/subtests" , test.getSubtestsByGroup)
app.post("/subtest/:groupId", test.addSubtest)


module.exports = app;
