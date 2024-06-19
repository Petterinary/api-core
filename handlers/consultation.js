const Consultation = require("../models/consultation");

const getConsultation = async (req, res) => {
  try {
    const consultations = await Consultation.ConsultationRead.getConsultation();
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConsultationsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const consultations = await Consultation.ConsultationRead.getConsultationsByUserId(userId);
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConsultationsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const consultations = await Consultation.ConsultationRead.getConsultationsByDoctorId(doctorId);
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDetailedConsultation = async (req, res) => {
  const { consultationId } = req.params;
  try {
    const consultation = await Consultation.ConsultationRead.getDetailedConsultation(consultationId);
    res.json(consultation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createConsultation = async (req, res) => {
  const {
    consultationId,
    stageStatus,
    userId,
    doctorId,
    serviceRegistrationFormId,
  } = req.body;
  try {
    const newConsultation = await Consultation.ConsultationWrite.createConsultation({
      consultationId,
      stageStatus,
      userId,
      doctorId,
      serviceRegistrationFormId,
    });
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConsultationById = async (req, res) => {
  const { consultationId } = req.params;
  const { stageStatus, userId, doctorId, serviceRegistrationFormId } = req.body;

  const updateData = {};
  if (stageStatus !== undefined) updateData.stageStatus = stageStatus;
  if (userId !== undefined) updateData.userId = userId;
  if (doctorId !== undefined) updateData.doctorId = doctorId;
  if (serviceRegistrationFormId !== undefined) updateData.serviceRegistrationFormId = serviceRegistrationFormId;

  try {
    const updatedConsultation = await Consultation.ConsultationWrite.updateConsultationById(consultationId, updateData);
    res.json(updatedConsultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConsultationById = async (req, res) => {
  const { consultationId } = req.params;
  try {
    await Consultation.ConsultationWrite.deleteConsultationById(consultationId);
    res.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getConsultation,
  getConsultationsByUserId,
  getConsultationsByDoctorId,
  getDetailedConsultation,
  createConsultation,
  updateConsultationById,
  deleteConsultationById,
};