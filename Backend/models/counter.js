const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Lab", "Bill"],
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CounterSchema.index({ userID: 1, type: 1 }, { unique: true });

const Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;
