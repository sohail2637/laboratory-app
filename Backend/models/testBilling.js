const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    bill_no: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Test",
          required: true,
        },

        test_name: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["simple", "subtest" , "group"],
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", BillingSchema);
