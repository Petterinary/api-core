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
  const { paymentId } = req.params;
  try {
    const payment = await Payment.PaymentRead.getPaymentById(paymentId);
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
  const { paymentMethod, consultationAmount, serviceAmount, transportAmount } = req.body;
  if (!consultationAmount || !serviceAmount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newPayment = await Payment.PaymentWrite.createPayment({
      paymentMethod,
      consultationAmount,
      serviceAmount,
      transportAmount
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
  const { paymentId } = req.params;
  const { paymentMethod, consultationAmount, serviceAmount, transportAmount, paymentStatus } = req.body;

  const updateData = {};
  if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
  if (consultationAmount !== undefined) updateData.consultationAmount = consultationAmount;
  if (serviceAmount !== undefined) updateData.serviceAmount = serviceAmount;
  if (transportAmount !== undefined) updateData.transportAmount = transportAmount;
  if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

  try {
    const updatedPayment = await Payment.PaymentWrite.updatePaymentById(paymentId, updateData);
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    await Payment.PaymentWrite.deletePaymentById(paymentId);
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