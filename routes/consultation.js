const express = require("express");
const router = express.Router();
const consultationHandlers = require("../handlers/consultation");

router.get("/", consultationHandlers.getConsultation);
router.get("/user/:userId", consultationHandlers.getConsultationsByUserId);
router.get("/doctor/:doctorId", consultationHandlers.getConsultationsByDoctorId);
router.get("/detailed/:idConsultation", consultationHandlers.getDetailedConsultation);
router.post("/create", consultationHandlers.createConsultation);
router.patch("/update/:idConsultation", consultationHandlers.updateConsultationById);
router.delete("/delete/:idConsultation", consultationHandlers.deleteConsultationById);

module.exports = router;