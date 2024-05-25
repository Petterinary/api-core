const Doctor = require("../models/doctor");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.DoctorRead.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  try {
    const doctor = await Doctor.DoctorRead.getDoctorById(doctorID);
    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createDoctor = async (req, res) => {
  const { name, phoneNumber, address, email = "", specialization = "" } = req.body;
  try {
    const newDoctor = await Doctor.DoctorWrite.createDoctor({ name, phoneNumber, address, email, specialization });
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  const { name, phoneNumber, address, email = "", specialization = "" } = req.body;
  try {
    const updatedDoctor = await Doctor.DoctorWrite.updateDoctorById(doctorID, { name, phoneNumber, address, email, specialization });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  try {
    await Doctor.DoctorWrite.deleteDoctorById(doctorID);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorById,
  deleteDoctorById,
};