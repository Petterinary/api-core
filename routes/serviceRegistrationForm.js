const express = require("express");
const router = express.Router();
const serviceRegistrationFormHandlers = require("../handlers/serviceRegistrationForm");

router.get("/", serviceRegistrationFormHandlers.getAllServiceRegistrationForms);
router.get("/:serviceRegistrationFormId", serviceRegistrationFormHandlers.getServiceRegistrationFormById);
router.post("/create", serviceRegistrationFormHandlers.createServiceRegistrationForm);
router.patch("/update/:serviceRegistrationFormId", serviceRegistrationFormHandlers.updateServiceRegistrationFormById);
router.delete("/delete/:serviceRegistrationFormId", serviceRegistrationFormHandlers.deleteServiceRegistrationFormById);

module.exports = router;