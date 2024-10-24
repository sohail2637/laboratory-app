const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        unit_name: {
            type: String,
            required: true,
        },
        unit_abb: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);


const Unit = mongoose.model("Unit", UnitSchema);
module.exports = Unit;
