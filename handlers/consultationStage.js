const ConsultationStage = require("../models/consultationStage");

const getAllConsultationStages = async (req, res) => {
  try {
    const stages = await ConsultationStage.ConsultationStageRead.getAllConsultationStages();
    const convertedStages = stages.map(stage => ({
      ...stage,
      createdAt: stage.createdAt ? convertToIndonesianTime(stage.createdAt) : null,
      updatedAt: stage.updatedAt ? convertToIndonesianTime(stage.updatedAt) : null,
    }));
    res.json(convertedStages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConsultationStageById = async (req, res) => {
  const { idConsultationStage } = req.params;
  try {
    const stage = await ConsultationStage.ConsultationStageRead.getConsultationStageById(idConsultationStage);
    const convertedStage = {
      ...stage,
      createdAt: stage.createdAt ? convertToIndonesianTime(stage.createdAt) : null,
      updatedAt: stage.updatedAt ? convertToIndonesianTime(stage.updatedAt) : null,
    };
    res.json(convertedStage);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createConsultationStage = async (req, res) => {
  const { statusInfo, passStatus } = req.body;
  if (!statusInfo || !passStatus) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newStage = await ConsultationStage.ConsultationStageWrite.createConsultationStage({ statusInfo, passStatus });
    const convertedStage = {
      ...newStage,
      createdAt: newStage.createdAt ? convertToIndonesianTime(newStage.createdAt) : null,
      updatedAt: newStage.updatedAt ? convertToIndonesianTime(newStage.updatedAt) : null,
    };
    res.status(201).json(convertedStage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConsultationStageById = async (req, res) => {
  const { idConsultationStage } = req.params;
  const newData = req.body;
  try {
    const updatedStage = await ConsultationStage.ConsultationStageWrite.updateConsultationStageById(idConsultationStage, newData);
    res.json(updatedStage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConsultationStageById = async (req, res) => {
  const { idConsultationStage } = req.params;
  try {
    await ConsultationStage.ConsultationStageWrite.deleteConsultationStageById(idConsultationStage);
    res.json({ message: "Consultation Stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConsultationStages,
  getConsultationStageById,
  createConsultationStage,
  updateConsultationStageById,
  deleteConsultationStageById,
};