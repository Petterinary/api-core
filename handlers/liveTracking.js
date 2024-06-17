const LiveTracking = require("../models/liveTracking");

const convertToIndonesianTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
};

const getAllLiveTracking = async (req, res) => {
    try {
        const liveTrackings = await LiveTracking.LiveTrackingRead.getAllLiveTracking();
        res.json(liveTrackings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserLiveTrackingByConsultationId = async (req, res) => {
    const { consultationId } = req.params;
    try {
        const liveTrackings = await LiveTracking.LiveTrackingRead.getUserLiveTrackingByConsultationId(consultationId);
        res.json(liveTrackings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDoctorLiveTrackingByConsultationId = async (req, res) => {
    const { consultationId } = req.params;
    try {
        const liveTrackings = await LiveTracking.LiveTrackingRead.getDoctorLiveTrackingByConsultationId(consultationId);
        res.json(liveTrackings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLiveTracking = async (req, res) => {
    const { consultationId, doctorId, userId, lat, lng } = req.body;
    try {
        const newLiveTracking = await LiveTracking.LiveTrackingWrite.createUserLiveTracking({
            consultationId,
            doctorId,
            userId,
            lat,
            lng,
        });
        const convertedForm = {
            ...newLiveTracking,
            createdAt: newLiveTracking.createdAt ? convertToIndonesianTime(newLiveTracking.createdAt) : null,
            updatedAt: newLiveTracking.updatedAt ? convertToIndonesianTime(newLiveTracking.updatedAt) : null,
        };
        res.status(201).json(convertedForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLiveTrackingById = async (req, res) => {
    const { liveTrackingId } = req.params;
    const { lat, lng } = req.body;
    try {
        const updatedLiveTracking = await LiveTracking.LiveTrackingWrite.updateLiveTrackingById(liveTrackingId, {
            lat,
            lng,
        });
        res.json(updatedLiveTracking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLiveTrackingById = async (req, res) => {
    const { liveTrackingId } = req.params;
    try {
        await LiveTracking.LiveTrackingWrite.deleteLiveTrackingById(liveTrackingId);
        res.json({ message: "LiveTracking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllLiveTracking,
    getUserLiveTrackingByConsultationId,
    getDoctorLiveTrackingByConsultationId,
    createLiveTracking,
    updateLiveTrackingById,
    deleteLiveTrackingById,
};