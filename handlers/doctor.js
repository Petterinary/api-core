const Doctor = require("../models/doctor");

const getAllDoctors = async (req, res) => {
  const doctors = await Doctor.DoctorRead.getAllDoctors();
  res.json(doctors);
};

const getDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  const doctor = await Doctor.DoctorRead.getDoctorById(doctorID);
  res.json(doctor);
};

const createDoctor = async (req, res) => {
  const { name, phoneNumber, address, email = "", specialization = "" } = req.body;
  const newDoctor = await Doctor.DoctorWrite.createDoctor({ name, phoneNumber, address, email, specialization });
  res.status(201).json(newDoctor);
};

const updateDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  const { name, phoneNumber, address, email = "", specialization = "" } = req.body;
  const updatedDoctor = await Doctor.DoctorWrite.updateDoctorById(doctorID, { name, phoneNumber, address, email, specialization });
  res.json(updatedDoctor);
};

const deleteDoctorById = async (req, res) => {
  const { doctorID } = req.params;
  await Doctor.DoctorWrite.deleteDoctorById(doctorID);
  res.json({ message: "Doctor deleted successfully" });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorById,
  deleteDoctorById,
};