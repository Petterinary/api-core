const { FieldValue } = require("firebase-admin/firestore");
const db = require("../firebaseAdmin");

const LiveTrackingRead = {
    getAllLiveTracking: async () => {
        try {
            const snapshot = await db.collection("LiveTrackings").orderBy("liveTrackingId", "asc").get();
            const list = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                return {
                    liveTrackingId: data.liveTrackingId || null,
                    consultationId: data.consultationId,
                    doctorId: data.doctorId,
                    lat: data.lat || "",
                    lng: data.lng || "",
                    userId: data.userId,
                    createdAt: data.createdAt ? data.createdAt.toDate() : null,
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
                };
            }));
            return list;
        } catch (error) {
            throw new Error("Failed to fetch live trackings: " + error.message);
        }
    },

    getDoctorLiveTrackingByConsultationId: async (consultationId) => {
        try {
            const snapshot = await db.collection("LiveTrackings").where("consultationId", "==", Number(consultationId)).get();
            if (snapshot.empty) throw new Error("No live trackings found for consultationId");

            const data = snapshot.docs[0].data();

            const userDocRef = db
            .collection("Users")
            .where("userId", "==", data.userId);
            const userSnapshot = await userDocRef.get();
            const userLat = !userSnapshot.empty
                ? userSnapshot.docs[0].data().lat
                : "";
            const userLng = !userSnapshot.empty
                ? userSnapshot.docs[0].data().lng
                : "";

            return {
                liveTrackingId: data.liveTrackingId || null,
                consultationId: data.consultationId,
                doctorId: data.doctorId,
                doctorLat: data.lat || "",
                doctorLng: data.lng || "",
                userId: data.userId,
                userLat: userLat,
                userLng: userLng,
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            };
        } catch (error) {
            throw new Error("Failed to fetch live tracking by consultationId: " + error.message);
        }
    },

    getUserLiveTrackingByConsultationId: async (consultationId) => {
        try {
            const snapshot = await db.collection("LiveTrackings").where("consultationId", "==", Number(consultationId)).get();
            if (snapshot.empty) throw new Error("No live trackings found for consultationId");

            const data = snapshot.docs[0].data();

            const doctorDocRef = db
            .collection("Doctors")
            .where("doctorId", "==", data.doctorId);
            const doctorSnapshot = await doctorDocRef.get();
            const doctorLat = !doctorSnapshot.empty
                ? doctorSnapshot.docs[0].data().lat
                : "";
            const doctorLng = !doctorSnapshot.empty
                ? doctorSnapshot.docs[0].data().lng
                : "";

            return {
                liveTrackingId: data.liveTrackingId || null,
                consultationId: data.consultationId,
                doctorId: data.doctorId,
                doctorLat: doctorLat,
                doctorLng: doctorLng,
                userId: data.userId,
                userLat: data.lat || "",
                userLng: data.lng || "",
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            };
        } catch (error) {
            throw new Error("Failed to fetch live tracking by consultationId: " + error.message);
        }
    },
};

const LiveTrackingWrite = {
    createUserLiveTracking: async ({ consultationId, doctorId, userId, lat, lng }) => {
        try {
            const counterRef = db.collection("LiveTrackingCounter").doc("liveTrackingCounter");
            const counterDoc = await counterRef.get();

            let newCount = 1;
            if (counterDoc.exists) {
                newCount = (counterDoc.data().count || 0) + 1;
                await counterRef.update({ count: newCount });
            } else {
                await counterRef.set({ count: newCount });
            }

            const newLiveTrackingRef = db.collection("LiveTrackings").doc();
            const newLiveTrackingData = {
                liveTrackingId: newCount,
                consultationId,
                doctorId,
                userId,
                lat,
                lng,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            };

            await newLiveTrackingRef.set(newLiveTrackingData);

            return {
                liveTrackingId: newCount,
                ...newLiveTrackingData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            throw new Error("Failed to create Live Tracking: " + error.message);
        }
    },

    updateLiveTrackingById: async (liveTrackingId, newData) => {
        try {
            const querySnapshot = await db.collection("LiveTrackings").where("liveTrackingId", "==", parseInt(liveTrackingId)).get();
            if (querySnapshot.empty) throw new Error("LiveTracking not found");

            const doc = querySnapshot.docs[0];
            newData.updatedAt = FieldValue.serverTimestamp();

            await db.collection("LiveTrackings").doc(doc.id).update(newData);
            return { msg: "LiveTracking updated" };
        } catch (error) {
            throw new Error("Failed to update LiveTracking: " + error.message);
        }
    },

    deleteLiveTrackingById: async (liveTrackingId) => {
        try {
            const querySnapshot = await db.collection("LiveTrackings").where("liveTrackingId", "==", parseInt(liveTrackingId)).get();
            if (querySnapshot.empty) throw new Error("LiveTrackings not found");

            const doc = querySnapshot.docs[0];
            await db.collection("LiveTrackings").doc(doc.id).delete();
            return { msg: "LiveTracking deleted" };
        } catch (error) {
            throw new Error("Failed to delete liveTracking: " + error.message);
        }
    },
};

module.exports = {
    LiveTrackingRead,
    LiveTrackingWrite,
};