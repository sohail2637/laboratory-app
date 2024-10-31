const express = require("express");
const app = express();
const patient = require("../controller/patient")

app.post("/add-patient", patient.addPatient );
app.get("/listing_patient/:userId",patient.getAllPatient );
app.delete("/delete_patient/:id",patient.deleteSelectedPatient );
app.get("/edit_patient/:id",patient.editPatient);
app.put("/update_patient/:id",patient.updatePatient );
  

module.exports = app;
