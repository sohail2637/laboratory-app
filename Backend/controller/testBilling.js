const Billing = require("../models/testBilling");
const Test = require("../models/tests");
const Patient = require("../models/patient");
const Payment = require("../models/payment");

exports.generateBill = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { userID } = req.body;

    if (!patientId || !userID) {
      return res.status(400).json({
        message: "Patient ID and User ID are required",
      });
    }

    // 1️⃣ Fetch patient (NO populate)
    const patient = await Patient.findById(patientId).lean();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    // 2️⃣ Collect billable test IDs
    const billableTestIds = [];

    for (const entry of patient.test_type || []) {

  // ✅ Simple test
  if (entry.test && !entry.subtests?.length) {
    billableTestIds.push(entry.test.toString());
  }

  // ✅ Group → only subtests
  if (entry.subtests?.length > 0) {
    for (const st of entry.subtests) {
      billableTestIds.push(st.subtest.toString());
    }
  }
}


    if (!billableTestIds.length) {
      return res.status(400).json({
        message: "No billable tests found for this patient",
      });
    }

    // 3️⃣ Fetch tests from Test collection
    const tests = await Test.find({
      _id: { $in: billableTestIds },
      userID,
    }).lean();
    if (!tests.length) {
      return res.status(400).json({
        message: "No matching tests found in database",
      });
    }
    // 4️⃣ Create lookup map (ID → Test)
    const testMap = new Map();
    for (const test of tests) {
      testMap.set(test._id.toString(), test);
    }

    // 5️⃣ Build bill items & total
    let items = [];
    let totalAmount = 0;

    for (const testId of billableTestIds) {
      const test = testMap.get(testId);

      if (!test) continue;

      // ❌ Never bill group
      if (test.type === "group") continue;

      // ❌ Safety check
      if (typeof test.price !== "number") continue;

      items.push({
        testId: test._id,
        test_name: test.test_name,
        type: test.type,
        price: test.price,
      });

      totalAmount += test.price;
    }

    if (!items.length) {
      return res.status(400).json({
        message: "No valid bill items after processing",
      });
    }

    // 6️⃣ Remove old bill (regeneration)
    await Billing.findOneAndDelete({ patientId });

    // 7️⃣ Create fresh bill
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
    return res.status(201).json({
      message: "Bill generated successfully",
      bill,
    });
  } catch (error) {
    console.error("Generate Bill Error:", error);
    return res.status(500).json({ message: "Server error" });
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

