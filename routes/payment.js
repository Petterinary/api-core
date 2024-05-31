const express = require("express");
const router = express.Router();
const paymentHandlers = require("../handlers/payment");

router.get("/", paymentHandlers.getAllPayments);
router.get("/:paymentID", paymentHandlers.getPaymentById);
router.post("/create", paymentHandlers.createPayment);
router.patch("/update/:paymentID", paymentHandlers.updatePaymentById);
router.delete("/delete/:paymentID", paymentHandlers.deletePaymentById);

module.exports = router;