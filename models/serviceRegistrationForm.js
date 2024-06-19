const { FieldValue } = require("firebase-admin/firestore");
const db = require("../firebaseAdmin");

const ServiceRegistrationFormRead = {
  getAllServiceRegistrationForms: async () => {
    try {
      const snapshot = await db.collection("ServiceRegistrationForms").orderBy("serviceRegistrationFormId", "asc").get();
      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          let doctorName = "";
          let userName = "";
          let address = "";
          let lat = "";
          let lng = "";

          if (data.userId) {
            try {
              const userDocRef = db.collection("Users").where("userId", "==", data.userId);
              const userSnapshot = await userDocRef.get();
              if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                userName = userData.username;
                if (data.visitType === "1") {
                  address = userData.address;
                  lat = userData.lat;
                  lng = userData.lng;
                }
              } else {
                console.log(`User with ID ${data.userId} not found.`);
              }
            } catch (error) {
              console.error(`Error fetching user data for ID ${data.userId}: ${error.message}`);
            }
          }

          if (data.doctorId) {
            try {
              const doctorQuery = await db.collection("Doctors").where("doctorId", "==", data.doctorId).get();
              if (!doctorQuery.empty) {
                const doctorData = doctorQuery.docs[0].data();
                doctorName = doctorData.name;
                if (data.visitType === "2") {
                  address = doctorData.address;
                  lat = doctorData.lat;
                  lng = doctorData.lng;
                }
              } else {
                console.log(`Doctor with ID ${data.doctorId} not found.`);
              }
            } catch (error) {
              console.error(`Error fetching doctor data for ID ${data.doctorId}: ${error.message}`);
            }
          }

          return {
            serviceRegistrationFormId: data.serviceRegistrationFormId || null,
            registrationDate: data.registrationDate ? data.registrationDate.toDate() : null,
            address,
            lat,
            lng,
            petName: data.petName || "",
            petType: data.petType || "",
            complaint: data.complaint || "",
            visitType: data.visitType || 0,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            doctorId: data.doctorId || "",
            doctorName,
            userId: data.userId || "",
            userName,
          };
        })
      );
      return list;
    } catch (error) {
      throw new Error("Failed to fetch service registration forms: " + error.message);
    }
  },

  getServiceRegistrationFormById: async (serviceRegistrationFormId) => {
    try {
      const snapshot = await db.collection("ServiceRegistrationForms").where("doctorId", "==", Number(serviceRegistrationFormId)).get();
      if (snapshot.empty) {
        return null;
      }

      const registrationData = snapshot.docs[0].data();
      return {
        serviceRegistrationFormId: registrationData.serviceRegistrationFormId || null,
        registrationDate: registrationData.registrationDate ? registrationData.registrationDate.toDate() : null,
        address: registrationData.address || "",
        lat: registrationData.lat || "",
        lng: registrationData.lng || "",
        petName: registrationData.petName || "",
        petType: registrationData.petType || "",
        complaint: registrationData.complaint || "",
        visitType: registrationData.visitType || 0,
        createdAt: registrationData.createdAt ? registrationData.createdAt.toDate() : null,
        updatedAt: registrationData.updatedAt ? registrationData.updatedAt.toDate() : null,
        doctorId: registrationData.doctorId || "",
        userId: registrationData.userId || "",
      };
    } catch (error) {
      console.error("Error fetching registration by serviceRegistrationFormId:", error);
      throw new Error("Failed to fetch registration by serviceRegistrationFormId: " + error.message);
    }
  },
};

const ServiceRegistrationFormWrite = {
  createServiceRegistrationForm: async ({
    registrationDate,
    address,
    petName,
    petType,
    complaint,
    visitType,
    doctorId,
    userId,
    lat,
    lng,
  }) => {
    try {
      const counterRef = db.collection("ServiceRegistrationFormCounter").doc("serviceRegistrationFormCounter");
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

      const newServiceRegistrationFormRef = db.collection("ServiceRegistrationForms").doc();
      const newServiceRegistrationFormData = {
        serviceRegistrationFormId: newCount,
        registrationDate: new Date(registrationDate),
        address,
        petName,
        petType,
        complaint,
        visitType,
        doctorId,
        userId,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newServiceRegistrationFormRef.set(newServiceRegistrationFormData);

      const counterRef2 = db.collection("ConsultationCounter").doc("consultationCounter");
      const counterDoc2 = await counterRef2.get();

      let newCount2;
      if (!counterDoc2.exists) {
        await counterRef2.set({ count: 1 });
        newCount2 = 1;
      } else {
        const currentCount = counterDoc2.data().count || 0;
        newCount2 = currentCount + 1;
        await counterRef2.update({ count: newCount2 });
      }

      const newConsultationRef = db.collection("Consultations").doc();
      const newConsultationData = {
        consultationId: newCount2,
        visitType,
        userId: userId,
        doctorId: doctorId,
        serviceRegistrationFormId: newCount,
        stageStatus: 0,
        passStatus: 0,
        paymentStatus: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newConsultationRef.set(newConsultationData);

      const counterRef3 = db.collection("LiveTrackingCounter").doc("liveTrackingCounter");
      const counterDoc3 = await counterRef3.get();

      let newCount3;
      if (!counterDoc3.exists) {
        await counterRef3.set({ count: 1 });
        newCount3 = 1;
      } else {
        const currentCount = counterDoc3.data().count || 0;
        newCount3 = currentCount + 1;
        await counterRef3.update({ count: newCount3 });
      }

      const newLiveTrackingRef = db.collection("LiveTrackings").doc();
      const newLiveTrackingData = {
        consultationId: newCount3,
        liveTrackingId: newCount,
        doctorId,
        userId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newLiveTrackingRef.set(newLiveTrackingData);

      return {
        serviceRegistrationFormId: newCount,
        consultationId: newCount2,
        ...newServiceRegistrationFormData,
        ...newConsultationData,
        ...newLiveTrackingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to create service registration form and consultation: " + error.message);
    }
  },

  updateServiceRegistrationFormById: async (
    serviceRegistrationFormId,
    newData
  ) => {
    try {
      const querySnapshot = await db
        .collection("ServiceRegistrationForms")
        .where(
          "serviceRegistrationFormId",
          "==",
          parseInt(serviceRegistrationFormId)
        )
        .get();
      if (querySnapshot.empty) {
        throw new Error("Service registration form not found");
      }
      const doc = querySnapshot.docs[0];

      newData.updatedAt = FieldValue.serverTimestamp();

      await db
        .collection("ServiceRegistrationForms")
        .doc(doc.id)
        .update(newData);
      return { msg: "Service registration form updated" };
    } catch (error) {
      throw new Error(
        "Failed to update service registration form: " + error.message
      );
    }
  },

  deleteServiceRegistrationFormById: async (serviceRegistrationFormId) => {
    try {
      const querySnapshot = await db
        .collection("ServiceRegistrationForms")
        .where(
          "serviceRegistrationFormId",
          "==",
          parseInt(serviceRegistrationFormId)
        )
        .get();
      if (querySnapshot.empty) {
        throw new Error("Service registration form not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("ServiceRegistrationForms").doc(doc.id).delete();
      return { msg: "Service registration form deleted" };
    } catch (error) {
      throw new Error(
        "Failed to delete service registration form: " + error.message
      );
    }
  },
};

module.exports = {
  ServiceRegistrationFormRead,
  ServiceRegistrationFormWrite,
};
