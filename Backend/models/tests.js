const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        test_name: {
            type: String,
            required: true,
        },
        min_value: {
            type: Number,
            required: true,
        },
        max_value: {
            type: Number,
            required: true,
        },
        unit:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            required: true, 
        }
       

    },
    { timestamps: true }
);


const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
