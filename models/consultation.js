const db = require("../firebaseAdmin");

const ConsultationRead = {
  getConsultation: async () => {
    try {
      const snapshot = await db.collection("Consultations").orderBy("idConsultation", "asc").get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Fetch user name
          const userSnapshot = await db.collection("Users").doc(data.idUser).get();
          const userName = userSnapshot.exists ? userSnapshot.data().name : "";

          // Fetch registration form data
          const registrationSnapshot = await db.collection("ServiceRegistrationForms").doc(data.idRegistrationForm).get();
          const registrationData = registrationSnapshot.exists ? registrationSnapshot.data() : {};

          // Fetch doctor name
          const doctorSnapshot = await db.collection("Doctors").where("doctorId", "==", data.idDoctor).get();
          const doctorName = doctorSnapshot.empty ? "" : doctorSnapshot.docs[0].data().name;

          // Fetch consultation stage status
          const stageSnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", data.stageStatus).get();
          const stageStatus = stageSnapshot.empty ? "" : stageSnapshot.docs[0].data().passStatus;

          return {
            idConsultation: data.idConsultation || null,
            stageStatus: stageStatus || "",
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            idUser: userName,
            idDoctor: doctorName,
            idRegistrationForm: {
              createdAt: registrationData.createdAt ? registrationData.createdAt.toDate() : null,
              visitType: registrationData.visitType || ""
            }
          };
        })
      );
      return list;
    } catch (error) {
      throw new Error("Failed to fetch consultations: " + error.message);
    }
  },

  getConsultationsByUserId: async (userId) => {
    try {
      const snapshot = await db.collection("Consultations").where("idUser", "==", userId).get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Fetch user name
          const userSnapshot = await db.collection("Users").doc(data.idUser).get();
          const userName = userSnapshot.exists ? userSnapshot.data().name : "";

          // Fetch registration form data
          const registrationSnapshot = await db.collection("ServiceRegistrationForms").doc(data.idRegistrationForm).get();
          const registrationData = registrationSnapshot.exists ? registrationSnapshot.data() : {};

          // Fetch doctor name
          const doctorSnapshot = await db.collection("Doctors").where("doctorId", "==", data.idDoctor).get();
          const doctorName = doctorSnapshot.empty ? "" : doctorSnapshot.docs[0].data().name;

          // Fetch consultation stage status
          const stageSnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", data.stageStatus).get();
          const stageStatus = stageSnapshot.empty ? "" : stageSnapshot.docs[0].data().passStatus;

          return {
            idConsultation: data.idConsultation || null,
            stageStatus: stageStatus || "",
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            idUser: userName,
            idDoctor: doctorName,
            idRegistrationForm: {
              createdAt: registrationData.createdAt ? registrationData.createdAt.toDate() : null,
              visitType: registrationData.visitType || ""
            }
          };
        })
      );
      return list;
    } catch (error) {
      throw new Error("Failed to fetch consultations by userId: " + error.message);
    }
  },

  getConsultationsByDoctorId: async (doctorId) => {
    try {
      const snapshot = await db.collection("Consultations").where("idDoctor", "==", doctorId).get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Fetch user name
          const userSnapshot = await db.collection("Users").doc(data.idUser).get();
          const userName = userSnapshot.exists ? userSnapshot.data().name : "";

          // Fetch registration form data
          const registrationSnapshot = await db.collection("ServiceRegistrationForms").doc(data.idRegistrationForm).get();
          const registrationData = registrationSnapshot.exists ? registrationSnapshot.data() : {};

          // Fetch doctor name
          const doctorSnapshot = await db.collection("Doctors").where("doctorId", "==", data.idDoctor).get();
          const doctorName = doctorSnapshot.empty ? "" : doctorSnapshot.docs[0].data().name;

          // Fetch consultation stage status
          const stageSnapshot = await db.collection("ConsultationStages").where("idConsultationStage", "==", data.stageStatus).get();
          const stageStatus = stageSnapshot.empty ? "" : stageSnapshot.docs[0].data().passStatus;

          return {
            idConsultation: data.idConsultation || null,
            stageStatus: stageStatus || "",
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            idUser: userName,
            idDoctor: doctorName,
            idRegistrationForm: {
              createdAt: registrationData.createdAt ? registrationData.createdAt.toDate() : null,
              visitType: registrationData.visitType || ""
            }
          };
        })
      );
      return list;
    } catch (error) {
      throw new Error("Failed to fetch consultations by doctorId: " + error.message);
    }
  },

  getDetailedConsultation: async (idConsultation) => {
    try {
      const querySnapshot = await db.collection("Consultations").where("idConsultation", "==", parseInt(idConsultation)).get();
      if (querySnapshot.empty) {
        throw new Error("Consultation not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      // Fetch user data
      const userSnapshot = await db.collection("Users").doc(data.idUser).get();
      const userData = userSnapshot.exists ? userSnapshot.data() : {};

      // Fetch registration form data
      const registrationSnapshot = await db.collection("ServiceRegistrationForms").doc(data.idRegistrationForm).get();
      const registrationData = registrationSnapshot.exists ? registrationSnapshot.data() : {};

      return {
        idConsultation: data.idConsultation || null,
        stageStatus: data.stageStatus || "",
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        user: {
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || ""
        },
        registrationForm: {
          complaint: registrationData.complaint || ""
        }
      };
    } catch (error) {
      throw new Error("Failed to fetch detailed consultation: " + error.message);
    }
  },
};

const ConsultationWrite = {
  createConsultation: async ({
    idConsultation,
    stageStatus,
    idUser,
    idDoctor,
    idRegistrationForm,
  }) => {
    try {
      const newConsultationRef = db.collection("Consultations").doc();
      const newConsultationData = {
        idConsultation,
        stageStatus,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        idUser,
        idDoctor,
        idRegistrationForm,
      };

      await newConsultationRef.set(newConsultationData);

      return {
        ...newConsultationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to create consultation: " + error.message);
    }
  },

  updateConsultationById: async (idConsultation, newData) => {
    try {
      const querySnapshot = await db.collection("Consultations").where("idConsultation", "==", parseInt(idConsultation)).get();
      if (querySnapshot.empty) {
        throw new Error("Consultation not found");
      }
      const doc = querySnapshot.docs[0];

      newData.updatedAt = FieldValue.serverTimestamp();

      await db.collection("Consultations").doc(doc.id).update(newData);
      return { msg: "Consultation updated" };
    } catch (error) {
      throw new Error("Failed to update consultation: " + error.message);
    }
  },

  deleteConsultationById: async (idConsultation) => {
    try {
      const querySnapshot = await db.collection("Consultations").where("idConsultation", "==", parseInt(idConsultation)).get();
      if (querySnapshot.empty) {
        throw new Error("Consultation not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Consultations").doc(doc.id).delete();
      return { msg: "Consultation deleted" };
    } catch (error) {
      throw new Error("Failed to delete consultation: " + error.message);
    }
  },
};

module.exports = {
  ConsultationRead,
  ConsultationWrite,
};