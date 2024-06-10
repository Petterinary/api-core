const express = require("express");
const router = express.Router();
const consultationStageHandlers = require("../handlers/consultationStage");

router.get("/", consultationStageHandlers.getAllConsultationStages);
router.get("/:idConsultationStage", consultationStageHandlers.getConsultationStageById);
router.post("/create", consultationStageHandlers.createConsultationStage);
router.patch("/update/:idConsultationStage", consultationStageHandlers.updateConsultationStageById);
router.delete("/delete/:idConsultationStage", consultationStageHandlers.deleteConsultationStageById);

module.exports = router;