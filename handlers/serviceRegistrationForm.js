const ServiceRegistrationForm = require("../models/serviceRegistrationForm");

const convertToIndonesianTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
};

const getAllServiceRegistrationForms = async (req, res) => {
  try {
    const serviceRegistrationForms = await ServiceRegistrationForm.ServiceRegistrationFormRead.getAllServiceRegistrationForms();
    const convertedForms = serviceRegistrationForms.map(form => ({
      ...form,
      createdAt: form.createdAt ? convertToIndonesianTime(form.createdAt) : null,
      updatedAt: form.updatedAt ? convertToIndonesianTime(form.updatedAt) : null,
      registrationDate: form.registrationDate ? convertToIndonesianTime(form.registrationDate) : null
    }));
    res.json(convertedForms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceRegistrationFormById = async (req, res) => {
  const { serviceRegistrationFormId } = req.params;
  try {
    const serviceRegistrationForm = await ServiceRegistrationForm.ServiceRegistrationFormRead.getServiceRegistrationFormById(serviceRegistrationFormId);
    const convertedForm = {
      ...serviceRegistrationForm,
      createdAt: serviceRegistrationForm.createdAt ? convertToIndonesianTime(serviceRegistrationForm.createdAt) : null,
      updatedAt: serviceRegistrationForm.updatedAt ? convertToIndonesianTime(serviceRegistrationForm.updatedAt) : null,
      registrationDate: serviceRegistrationForm.registrationDate ? convertToIndonesianTime(serviceRegistrationForm.registrationDate) : null
    };
    res.json(convertedForm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createServiceRegistrationForm = async (req, res) => {
  const { registrationDate, address, petName, petType, complaint, visitType, doctorId, userId } = req.body;
  if (!registrationDate || !address || !petName || !petType || !complaint || !visitType || !doctorId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newServiceRegistrationForm = await ServiceRegistrationForm.ServiceRegistrationFormWrite.createServiceRegistrationForm({
      registrationDate,
      address,
      petName,
      petType,
      complaint,
      visitType,
      doctorId,
      userId,
    });
    const convertedForm = {
      ...newServiceRegistrationForm,
      createdAt: newServiceRegistrationForm.createdAt ? convertToIndonesianTime(newServiceRegistrationForm.createdAt) : null,
      updatedAt: newServiceRegistrationForm.updatedAt ? convertToIndonesianTime(newServiceRegistrationForm.updatedAt) : null,
      registrationDate: newServiceRegistrationForm.registrationDate ? convertToIndonesianTime(newServiceRegistrationForm.registrationDate) : null
    };
    res.status(201).json(convertedForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceRegistrationFormById = async (req, res) => {
  const { serviceRegistrationFormId } = req.params;
  const newData = req.body;
  try {
    const updatedServiceRegistrationForm = await ServiceRegistrationForm.ServiceRegistrationFormWrite.updateServiceRegistrationFormById(serviceRegistrationFormId, newData);
    res.json(updatedServiceRegistrationForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteServiceRegistrationFormById = async (req, res) => {
  const { serviceRegistrationFormId } = req.params;
  try {
    await ServiceRegistrationForm.ServiceRegistrationFormWrite.deleteServiceRegistrationFormById(serviceRegistrationFormId);
    res.json({ message: "Service registration form deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllServiceRegistrationForms,
  getServiceRegistrationFormById,
  createServiceRegistrationForm,
  updateServiceRegistrationFormById,
  deleteServiceRegistrationFormById,
};