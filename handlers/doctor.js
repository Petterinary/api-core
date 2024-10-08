const Doctor = require("../models/doctor");

const getAllDoctors = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const doctors = await Doctor.DoctorRead.getAllDoctors(parseFloat(lat), parseFloat(lng));
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
  const {
    name,
    phoneNumber,
    address,
    email = "",
    specialization = "",
    lat,
    lng,
  } = req.body;
  try {
    const newDoctor = await Doctor.DoctorWrite.createDoctor({
      name,
      phoneNumber,
      address,
      email,
      specialization,
      lat,
      lng,
    });
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  const {
    name,
    phoneNumber,
    address,
    email = "",
    specialization = "",
    lat,
    lng,
  } = req.body;
  try {
    const updatedDoctor = await Doctor.DoctorWrite.updateDoctorById(doctorID, {
      name,
      phoneNumber,
      address,
      email,
      specialization,
      lat,
      lng,
    });
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
