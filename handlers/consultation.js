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
    idConsultation,
    stageStatus,
    idUser,
    idDoctor,
    idRegistrationForm,
  } = req.body;
  try {
    const newConsultation = await Consultation.ConsultationWrite.createConsultation({
      idConsultation,
      stageStatus,
      idUser,
      idDoctor,
      idRegistrationForm,
    });
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConsultationById = async (req, res) => {
  const { idConsultation } = req.params;
  const { stageStatus, idUser, idDoctor, idRegistrationForm } = req.body;
  try {
    const updatedConsultation = await Consultation.ConsultationWrite.updateConsultationById(idConsultation, {
      stageStatus,
      idUser,
      idDoctor,
      idRegistrationForm,
    });
    res.json(updatedConsultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConsultationById = async (req, res) => {
  const { idConsultation } = req.params;
  try {
    await Consultation.ConsultationWrite.deleteConsultationById(idConsultation);
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