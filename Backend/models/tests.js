// const mongoose = require("mongoose");

// const subtestSchema = new mongoose.Schema({
//     min_value: { type: Number, required: true },
//     max_value: { type: Number, required: true },
//     price: { type: Number},
//     test_name: {
//         type: String,
//         required: true,
//     },
// })

// const TestSchema = new mongoose.Schema(
//     {
//         userID: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "users",
//             required: true,
//         },
//         test_name: {
//             type: String,
//             required: true,
//         },
//         min_value: {
//             type: String,
//             // required: true,
//         },
//         max_value: {
//             type: String,
//             // required: true,
//         },
//         price: { type: Number},
//         unit: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Unit",
//             // required: true,
//         },

//         subtests: { type: [subtestSchema], default: [] }

//     },
//     { timestamps: true }
// );


// const Test = mongoose.model("Test", TestSchema);
// module.exports = Test;
const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    type: {
        type: String,
        enum: ["simple", "group", "subtest"],
        required: true,
    },

    test_name: { type: String, required: true },

    min_value: { type: Number },
    max_value: { type: Number },
    price: { type: Number },

    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
    },

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        default: null,
    }

}, { timestamps: true });

module.exports = mongoose.model("Test", TestSchema);
