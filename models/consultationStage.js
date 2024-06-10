const db = require("../firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

const ConsultationStageRead = {
    getAllConsultationStages: async () => {
        try {
            const snapshot = await db.collection("ConsultationStages").orderBy("idConsultationStage", "asc").get();
            const list = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    idConsultationStage: data.idConsultationStage || null,
                    statusInfo: data.statusInfo || "",
                    passStatus: data.passStatus || "",
                    createdAt: data.createdAt ? data.createdAt.toDate() : null,
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
                };
            });
            return list;
        } catch (error) {
            throw new Error("Failed to fetch consultation stages: " + error.message);
        }
    },

    getConsultationStageById: async (idConsultationStage) => {
        try {
            const querySnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", parseInt(idConsultationStage)).get();
            if (querySnapshot.empty) {
                throw new Error("Consultation Stage not found");
            }
            const doc = querySnapshot.docs[0];
            const data = doc.data();

            return {
                idConsultationStage: data.idConsultationStage || null,
                statusInfo: data.statusInfo || "",
                passStatus: data.passStatus || "",
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            };
        } catch (error) {
            throw new Error("Failed to fetch consultation stage: " + error.message);
        }
    },
};

const ConsultationStageWrite = {
    createConsultationStage: async ({ statusInfo, passStatus }) => {
        try {
            const counterRef = db.collection("ConsultationStageCounter").doc("consultationStageCounter");
            const counterDoc = await counterRef.get();

            let newCount;
            if (!counterDoc.exists) {
                await counterRef.set({ count: 1 });
                newCount = 1;
            } else {
                const currentCount = counterDoc.data().count || 0;
                newCount = currentCount + 1;
                await counterRef.update({ count: newCount });
            }

            const newConsultationStageRef = db.collection("ConsultationStages").doc();
            const newConsultationStageData = {
                idConsultationStage: newCount,
                statusInfo,
                passStatus,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            };

            await newConsultationStageRef.set(newConsultationStageData);

            return {
                idConsultationStage: newCount,
                ...newConsultationStageData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            throw new Error("Failed to create consultation stage: " + error.message);
        }
    },

    updateConsultationStageById: async (idConsultationStage, newData) => {
        try {
            const querySnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", parseInt(idConsultationStage)).get();
            if (querySnapshot.empty) {
                throw new Error("Consultation Stage not found");
            }
            const doc = querySnapshot.docs[0];

            newData.updatedAt = FieldValue.serverTimestamp();

            await db.collection("ConsultationStages").doc(doc.id).update(newData);
            return { msg: "Consultation Stage updated" };
        } catch (error) {
            throw new Error("Failed to update consultation stage: " + error.message);
        }
    },

    deleteConsultationStageById: async (idConsultationStage) => {
        try {
            const querySnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", parseInt(idConsultationStage)).get();
            if (querySnapshot.empty) {
                throw new Error("Consultation Stage not found");
            }
            const doc = querySnapshot.docs[0];
            await db.collection("ConsultationStages").doc(doc.id).delete();
            return { msg: "Consultation Stage deleted" };
        } catch (error) {
            throw new Error("Failed to delete consultation stage: " + error.message);
        }
    },
};

module.exports = {
    ConsultationStageRead,
    ConsultationStageWrite,
};