const Payment = require("../models/payment");

const convertToIndonesianTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }); // WIB
  // For WITA use "Asia/Makassar"
  // For WIT use "Asia/Jayapura"
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.PaymentRead.getAllPayments();
    const convertedPayments = payments.map(payment => ({
      ...payment,
      createdAt: payment.createdAt ? convertToIndonesianTime(payment.createdAt) : null,
      updatedAt: payment.updatedAt ? convertToIndonesianTime(payment.updatedAt) : null
    }));
    res.json(convertedPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  const { paymentID } = req.params;
  try {
    const payment = await Payment.PaymentRead.getPaymentById(paymentID);
    const convertedPayment = {
      ...payment,
      createdAt: payment.createdAt ? convertToIndonesianTime(payment.createdAt) : null,
      updatedAt: payment.updatedAt ? convertToIndonesianTime(payment.updatedAt) : null
    };
    res.json(convertedPayment);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createPayment = async (req, res) => {
  const { consultationAmount, serviceAmount } = req.body;
  if (!consultationAmount || !serviceAmount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newPayment = await Payment.PaymentWrite.createPayment({
      consultationAmount,
      serviceAmount
    });
    const convertedPayment = {
      ...newPayment,
      createdAt: convertToIndonesianTime(newPayment.createdAt),
      updatedAt: convertToIndonesianTime(newPayment.updatedAt)
    };
    res.status(201).json(convertedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentById = async (req, res) => {
  const { paymentID } = req.params;
  const { paymentMethod, consultationAmount, serviceAmount, paymentStatus } = req.body;
  try {
    const updatedPayment = await Payment.PaymentWrite.updatePaymentById(paymentID, {
      paymentMethod,
      consultationAmount,
      serviceAmount,
      paymentStatus
    });
    const convertedPayment = {
      ...updatedPayment,
      updatedAt: convertToIndonesianTime(updatedPayment.updatedAt)
    };
    res.json(convertedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePaymentById = async (req, res) => {
  const { paymentID } = req.params;
  try {
    await Payment.PaymentWrite.deletePaymentById(paymentID);
    res.json({ message: "Payment hidden successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentById,
  deletePaymentById,
};