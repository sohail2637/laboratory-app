const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        patient_name: {
            type: String,
            required: true,
        },
        patient_age: {
            type: Number,
            required: true,
        },
        refer_by: {
            type: String,
            required: true,
        },
        lab_no: {
            type: String,
            required: true,
        },
        patient_bill: {
            type: Number,
        },
        phone_number: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            // required: true,
        },
        specimen: {
            type: String,
            required: true,
        },
        test_type: [
            {
                test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
                result: { type: Number },
                subtests: [
                    {
                        subtest: { type: mongoose.Schema.Types.ObjectId, ref: "Test.subtests" },
                        result: { type: Number }
                    }]
            }]

    },
    { timestamps: true }
);


const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;
