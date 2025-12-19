const Payment = require("../models/payment");
const Billing = require("../models/testBilling");

exports.addPayment = async (req, res) => {
  try {
    const { billingId, amount, paymentMethod, note  , userID} = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const billing = await Billing.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

    // Prevent overpayment
    if (amount > billing.balanceAmount) {
      return res.status(400).json({ message: "Amount exceeds balance" });
    }

    // 1️⃣ Create payment
    await Payment.create({
      userID,
      billingId,
      amount,
      paymentMethod,
      note,
    });

    // 2️⃣ Recalculate totals
    billing.paidAmount += amount;
    billing.balanceAmount = billing.totalAmount - billing.paidAmount;

    if (billing.balanceAmount === 0) {
      billing.status = "PAID";
    } else {
      billing.status = "PARTIAL";
    }

    await billing.save();

    res.status(201).json({
      message: "Payment added successfully",
      billing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
