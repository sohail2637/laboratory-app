const express = require("express");
const router = express.Router();
const billingCtrl = require("../controller/testBilling");

router.post("/generate/:patientId", billingCtrl.generateBill);
router.get("/:patientId", billingCtrl.getBillingByPatient);
// router.post("/add-payment/:billingId", billingCtrl.addPayment);
// router.get("/payments/:billingId", billingCtrl.getPayments);

module.exports = router;
