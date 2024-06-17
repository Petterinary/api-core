const express = require("express");
const router = express.Router();
const consultationHandlers = require("../handlers/consultation");

router.get("/", consultationHandlers.getConsultation);
router.get("/user/:userId", consultationHandlers.getConsultationsByUserId);
router.get("/doctor/:doctorId", consultationHandlers.getConsultationsByDoctorId);
router.get("/detailed/:consultationId", consultationHandlers.getDetailedConsultation);
router.post("/create", consultationHandlers.createConsultation);
router.patch("/update/:consultationId", consultationHandlers.updateConsultationById);
router.delete("/delete/:consultationId", consultationHandlers.deleteConsultationById);

module.exports = router;