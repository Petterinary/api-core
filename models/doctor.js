const db = require("../firebaseAdmin");

const DoctorRead = {
  getAllDoctors: async () => {
    try {
      const snapshot = await db.collection("Doctors").where("visible", "==", 1).orderBy("doctorId", "asc").get();
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          doctorId: data.doctorId || null,
          name: data.name || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          email: data.email || "",
          specialization: data.specialization || "",
          visible: data.visible || 1,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch doctors: " + error.message);
    }
  },
  getDoctorById: async (doctorID) => {
    try {
      const querySnapshot = await db.collection("Doctors").where("doctorId", "==", parseInt(doctorID)).where("visible", "==", 1).get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        doctorId: data.doctorId || null,
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        email: data.email || "",
        specialization: data.specialization || "",
        visible: data.visible || 1,
      };
    } catch (error) {
      throw new Error("Failed to fetch doctor");
    }
  },
};

const DoctorWrite = {
  createDoctor: async ({ name, phoneNumber, address, email = "", specialization = "" }) => {
    try {
      const counterRef = db.collection("DoctorCounter").doc("doctorCounter");
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

      const newDoctorRef = db.collection("Doctors").doc();
      const newDoctorData = {
        doctorId: newCount,
        name,
        phoneNumber,
        address,
        email,
        specialization,
        visible: 1, // Set visibility to 1 for new doctors
      };

      await newDoctorRef.set(newDoctorData);

      return {
        doctorId: newCount,
        ...newDoctorData
      };
    } catch (error) {
      throw new Error("Failed to create doctor: " + error.message);
    }
  },

  updateDoctorById: async (doctorID, newData) => {
    try {
      const querySnapshot = await db.collection("Doctors").where("doctorId", "==", parseInt(doctorID)).get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Doctors").doc(doc.id).update(newData);
      return { msg: "Doctor updated" };
    } catch (error) {
      throw new Error("Failed to update doctor: " + error.message);
    }
  },

  deleteDoctorById: async (doctorID) => {
    try {
      const querySnapshot = await db.collection("Doctors").where("doctorId", "==", parseInt(doctorID)).get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Doctors").doc(doc.id).update({ visible: 0 }); // Update visibility to 0 instead of deleting
      return { msg: "Doctor hidden" };
    } catch (error) {
      throw new Error("Failed to hide doctor: " + error.message);
    }
  },
};

module.exports = {
  DoctorRead,
  DoctorWrite
};