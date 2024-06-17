const express = require("express");
const router = express.Router();
const liveTrackingHandlers = require("../handlers/liveTracking");

router.get("/", liveTrackingHandlers.getAllLiveTracking);
router.get("/user/:consultationId", liveTrackingHandlers.getUserLiveTrackingByConsultationId);
router.get("/doctor/:consultationId", liveTrackingHandlers.getDoctorLiveTrackingByConsultationId);
router.post("/create", liveTrackingHandlers.createLiveTracking);
router.patch("/update/:liveTrackingId", liveTrackingHandlers.updateLiveTrackingById);
router.delete("/delete/:liveTrackingId", liveTrackingHandlers.deleteLiveTrackingById);

module.exports = router;