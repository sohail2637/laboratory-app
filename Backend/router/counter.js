const express = require("express");
const app = express();
const counter = require("../controller/counter");

app.post("/next/:userId",counter.getNextCounter );

app.get("/next/:userId",counter.getCurrentCounter );



module.exports = app;
