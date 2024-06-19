const express = require("express");
const router = express.Router();
const paymentHandlers = require("../handlers/payment");

router.get("/", paymentHandlers.getAllPayments);
router.get("/:paymentId", paymentHandlers.getPaymentById);
router.post("/create", paymentHandlers.createPayment);
router.patch("/update/:paymentId", paymentHandlers.updatePaymentById);
router.delete("/delete/:paymentId", paymentHandlers.deletePaymentById);

module.exports = router;