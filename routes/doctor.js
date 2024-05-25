const express = require("express");
const router = express.Router();
const doctorHandlers = require("../handlers/doctor");

router.get("/", doctorHandlers.getAllDoctors);
router.get("/:doctorID", doctorHandlers.getDoctorById);
router.post("/create", doctorHandlers.createDoctor);
router.patch("/update/:doctorID", doctorHandlers.updateDoctorById);
router.delete("/delete/:doctorID", doctorHandlers.deleteDoctorById);

module.exports = router;