const { FieldValue } = require("firebase-admin/firestore");
const db = require("../firebaseAdmin");

const ConsultationRead = {
  getConsultation: async () => {
    try {
      const snapshot = await db
        .collection("Consultations")
        .orderBy("consultationId", "asc")
        .get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Check if userId and doctorId exist
          if (!data.userId) {
            console.error("Consultation document missing userId:", data);
            throw new Error("Consultation document missing userId");
          }

          if (!data.doctorId) {
            console.error("Consultation document missing doctorId:", data);
            throw new Error("Consultation document missing doctorId");
          }

          // Fetch user name
          const userDocRef = db
            .collection("Users")
            .where("userId", "==", data.userId);
          const userSnapshot = await userDocRef.get();
          const userName = !userSnapshot.empty
            ? userSnapshot.docs[0].data().username
            : "";

          // Fetch doctor name
          const doctorDocRef = db
            .collection("Doctors")
            .where("doctorId", "==", data.doctorId);
          const doctorSnapshot = await doctorDocRef.get();
          const doctorName = !doctorSnapshot.empty
            ? doctorSnapshot.docs[0].data().name
            : "";

          return {
            consultationId: data.consultationId || null,
            serviceRegistrationFormId: data.serviceRegistrationFormId,
            paymentId: data.paymentId,
            visitType: data.visitType || "",
            doctorId: data.doctorId,
            doctorName: doctorName,
            userId: data.userId,
            userName: userName,
            stageStatus: data.stageStatus,
            passStatus: data.passStatus,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          };
        })
      );

      return list;
    } catch (error) {
      console.error("Error fetching consultations by userId:", error);
      throw new Error(
        "Failed to fetch consultations by userId: " + error.message
      );
    }
  },

  getConsultationsByUserId: async (userId) => {
    try {
      const snapshot = await db
        .collection("Consultations")
        .where("userId", "==", Number(userId))
        .get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          // Check if userId and doctorId exist
          if (!data.userId) {
            console.error("Consultation document missing userId:", data);
            throw new Error("Consultation document missing userId");
          }

          if (!data.doctorId) {
            console.error("Consultation document missing doctorId:", data);
            throw new Error("Consultation document missing doctorId");
          }

          // Fetch user name
          const userDocRef = db
            .collection("Users")
            .where("userId", "==", data.userId);
          const userSnapshot = await userDocRef.get();
          const userName = !userSnapshot.empty
            ? userSnapshot.docs[0].data().username
            : "";
          const userGender = !userSnapshot.empty
            ? userSnapshot.docs[0].data().gender
            : "";

          // Fetch doctor name
          const doctorDocRef = db
            .collection("Doctors")
            .where("doctorId", "==", data.doctorId);
          const doctorSnapshot = await doctorDocRef.get();
          const doctorName = !doctorSnapshot.empty ? doctorSnapshot.docs[0].data().name : "";
          const doctorGender = !doctorSnapshot.empty ? doctorSnapshot.docs[0].data().gender : "";

          // Fetch complaint
          const serviceRegistrationFormDocRef = db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", data.serviceRegistrationFormId);
          const serviceRegistrationFormSnapshot = await serviceRegistrationFormDocRef.get();
          const complaint = !serviceRegistrationFormSnapshot.empty ? serviceRegistrationFormSnapshot.docs[0].data().complaint : "";

          return {
            consultationId: data.consultationId || null,
            serviceRegistrationFormId: data.serviceRegistrationFormId,
            paymentId: data.paymentId,
            visitType: data.visitType || "",
            complaint: complaint,
            doctorId: data.doctorId,
            doctorName: doctorName,
            doctorGender: doctorGender,
            userId: data.userId,
            userName: userName,
            userGender: userGender,
            stageStatus: data.stageStatus,
            paymentStatus: data.paymentStatus,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          };
        })
      );

      return list;
    } catch (error) {
      console.error("Error fetching consultations by userId:", error);
      throw new Error(
        "Failed to fetch consultations by userId: " + error.message
      );
    }
  },

  getConsultationsByDoctorId: async (doctorId) => {
    try {
      const snapshot = await db
        .collection("Consultations")
        .where("doctorId", "==", Number(doctorId))
        .get();

      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Check if userId and doctorId exist
          if (!data.userId) {
            throw new Error("Consultation document missing userId");
          }

          if (!data.doctorId) {
            throw new Error("Consultation document missing doctorId");
          }

          // Fetch user name
          const userDocRef = db
            .collection("Users")
            .where("userId", "==", data.userId);
          const userSnapshot = await userDocRef.get();
          const userName = !userSnapshot.empty
            ? userSnapshot.docs[0].data().username
            : "";
          const userGender = !userSnapshot.empty
            ? userSnapshot.docs[0].data().gender
            : "";

          // Fetch doctor name
          const doctorDocRef = db
            .collection("Doctors")
            .where("doctorId", "==", data.doctorId);
          const doctorSnapshot = await doctorDocRef.get();
          const doctorName = !doctorSnapshot.empty
            ? doctorSnapshot.docs[0].data().name
            : "";
          const doctorGender = !doctorSnapshot.empty
            ? doctorSnapshot.docs[0].data().gender
            : "";

          // Fetch complaint
          const serviceRegistrationFormDocRef = db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", data.serviceRegistrationFormId);
          const serviceRegistrationFormSnapshot = await serviceRegistrationFormDocRef.get();
          const complaint = !serviceRegistrationFormSnapshot.empty ? serviceRegistrationFormSnapshot.docs[0].data().complaint : "";

          return {
            consultationId: data.consultationId || null,
            serviceRegistrationFormId: data.serviceRegistrationFormId,
            paymentId: data.paymentId,
            visitType: data.visitType || "",
            complaint: complaint,
            doctorId: data.doctorId,
            doctorName: doctorName,
            doctorGender: doctorGender,
            userId: data.userId,
            userName: userName,
            userGender: userGender,
            stageStatus: data.stageStatus,
            paymentStatus: data.paymentStatus,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          };
        })
      );

      return list;
    } catch (error) {
      console.error("Error fetching consultations by doctorId:", error);
      throw new Error(
        "Failed to fetch consultations by doctorId: " + error.message
      );
    }
  },

  getDetailedConsultation: async (consultationId) => {
    try {
      const snapshot = await db
        .collection("Consultations")
        .where("consultationId", "==", Number(consultationId))
        .get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Check if userId and doctorId exist
          if (!data.userId) {
            console.error("Consultation document missing userId:", data);
            throw new Error("Consultation document missing userId");
          }

          if (!data.doctorId) {
            console.error("Consultation document missing doctorId:", data);
            throw new Error("Consultation document missing doctorId");
          }

          // Fetch user name
          const userDocRef = db
            .collection("Users")
            .where("userId", "==", data.userId);
          const userSnapshot = await userDocRef.get();
          const userName = !userSnapshot.empty
            ? userSnapshot.docs[0].data().username
            : "";

          // Fetch doctor name
          const doctorDocRef = db
            .collection("Doctors")
            .where("doctorId", "==", data.doctorId);
          const doctorSnapshot = await doctorDocRef.get();
          const doctorName = !doctorSnapshot.empty
            ? doctorSnapshot.docs[0].data().name
            : "";

          return {
            consultationId: data.consultationId || null,
            serviceRegistrationFormId: data.serviceRegistrationFormId,
            paymentId: data.paymentId,
            visitType: data.visitType || "",
            doctorId: data.doctorId,
            doctorName: doctorName,
            userId: data.userId,
            userName: userName,
            stageStatus: data.stageStatus,
            paymentStatus: data.paymentStatus,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          };
        })
      );

      return list;
    } catch (error) {
      console.error("Error fetching consultations by doctorId:", error);
      throw new Error(
        "Failed to fetch consultations by doctorId: " + error.message
      );
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

  updateConsultationById: async (consultationId, newData) => {
    try {
        const querySnapshot = await db
            .collection("Consultations")
            .where("consultationId", "==", parseInt(consultationId))
            .get();

        if (querySnapshot.empty) {
            throw new Error("Consultation not found");
        }

        const doc = querySnapshot.docs[0];

        const updateData = {};
        for (const key in newData) {
            if (newData[key] !== undefined) {
                updateData[key] = newData[key];
            }
        }
        updateData.updatedAt = FieldValue.serverTimestamp();

        await db.collection("Consultations").doc(doc.id).update(updateData);
        return { msg: "Consultation updated" };
    } catch (error) {
        throw new Error("Failed to update consultation: " + error.message);
    }
  },

  deleteConsultationById: async (consultationId) => {
    try {
      const querySnapshot = await db
        .collection("Consultations")
        .where("consultationId", "==", parseInt(consultationId))
        .get();
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