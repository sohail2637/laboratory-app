const Billing = require("../models/testBilling");
const Test = require("../models/tests");
const Patient = require("../models/patient");
const Payment = require("../models/payment");


exports.generateBill = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { userID } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // 1️⃣ Check patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // 2️⃣ Prevent duplicate bill
    const existingBill = await Billing.findOne({ patientId });
    if (existingBill) return res.status(400).json({ message: "Bill already generated" });

    // 3️⃣ Build billable test IDs
    const billableTestIds = [];

    patient.test_type.forEach((pt) => {
      if (!pt.subtests || pt.subtests.length === 0) {
        if (pt.test) billableTestIds.push(pt.test);
      } else {
        pt.subtests.forEach((sub) => {
          if (sub.subtest) billableTestIds.push(sub.subtest);
        });
      }
    });

    // 4️⃣ Fetch patient tests
    const tests = await Test.find({
      userID,
      _id: { $in: billableTestIds.filter(Boolean) },
    });

    if (!tests.length) return res.status(400).json({ message: "No billable tests found" });

    // 5️⃣ Build bill items and total amount
    let totalAmount = 0;
    const items = tests.map((test) => {
      totalAmount += test.price || 0;
      return {
        testId: test._id,
        test_name: test.test_name,
        type: test.type,
        price: test.price || 0,
      };
    });

    // 6️⃣ Create bill
    try {
      const bill = await Billing.create({
        userID,
        patientId,
        bill_no: `BILL-${Date.now()}`,
        items,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        status: "UNPAID",
      });
      return res.status(201).json({ message: "Bill generated successfully", bill });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Cannot generate bill: duplicate entry detected" });
      }
      return res.status(500).json({ message: "Server error" });
    }


    res.status(201).json({ message: "Bill generated successfully", bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBillingByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const bill = await Billing.findOne({ patientId }).populate("patientId");
    if (!bill) {
      return res.status(404).json({ message: "No bill found" });
    }

    const payments = await Payment.find({ billingId: bill._id });

    res.json({ bill, payments });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

