const ServiceRegistrationForm = require("../models/serviceRegistrationForm");

const getAllServiceRegistrationForms = async (req, res) => {
  try {
    const serviceRegistrationForms = await ServiceRegistrationForm.ServiceRegistrationFormRead.getAllServiceRegistrationForms();
    res.json(serviceRegistrationForms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceRegistrationFormById = async (req, res) => {
  const { serviceRegistrationFormId } = req.params;
  try {
    const serviceRegistrationForm = await ServiceRegistrationForm.ServiceRegistrationFormRead.getServiceRegistrationFormById(serviceRegistrationFormId);
    res.json(serviceRegistrationForm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createServiceRegistrationForm = async (req, res) => {
  const { serviceType, registrationDate, doctorName, patientName, phoneNumber, complaint } = req.body;
  try {
    const newServiceRegistrationForm = await ServiceRegistrationForm.ServiceRegistrationFormWrite.createServiceRegistrationForm({
      serviceType,
      registrationDate,
      doctorName,
      patientName,
      phoneNumber,
      complaint,
    });
    res.status(201).json(newServiceRegistrationForm);
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