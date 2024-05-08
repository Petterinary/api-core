const db = require("../config");

const DoctorRead = {
  getAllDoctors: async () => {
    try {
        const snapshot = await db.collection("Doctors").get();
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return list;
      } catch (error) {
        throw new Error("Failed to fetch doctors");
      }
  },
  getDoctorById: async (doctorID) => {
    try {
        const doc = await db.collection("Doctors").doc(doctorID).get();
        if (!doc.exists) {
          throw new Error("Doctor not found");
        }
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        throw new Error("Failed to fetch doctor");
      }
  },
};

const DoctorWrite = {
    createDoctor: async ({ name, phoneNumber, address, email, specialization = "" }) => {
      try {
        const docRef = await db.collection("Doctors").add({
          name,
          phoneNumber,
          address,
          email,
          specialization,
        });

        const doc = await docRef.get();
        if (!doc.exists) {
          throw new Error("Failed to create doctor");
        }

        return { id: doc.id, ...doc.data() };
      } catch (error) {
        throw new Error("Failed to create doctor");
      }
    },

    updateDoctorById: async (doctorID, newData) => {
      try {
        await db.collection("Doctors").doc(doctorID).update(newData);
        return { msg: "Doctor updated" };
      } catch (error) {
        throw new Error("Failed to update doctor");
      }
    },

    deleteDoctorById: async (doctorID) => {
      try {
        await db.collection("Doctors").doc(doctorID).delete();
        return { msg: "Doctor deleted" };
      } catch (error) {
        throw new Error("Failed to delete doctor");
      }
    },
  };

module.exports = {
    DoctorRead,
    DoctorWrite
};