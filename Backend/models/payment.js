const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    billingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
      default: "Cash",
    },

    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
