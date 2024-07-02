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
      const snapshot = await db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", Number(serviceRegistrationFormId)).get();
      if (snapshot.empty) {
        return null;
      }

      const registrationData = snapshot.docs[0].data();

      const userDocRef = db
        .collection("Users")
        .where("userId", "==", registrationData.userId);
        const userSnapshot = await userDocRef.get();
        const userPhoneNumber = !userSnapshot.empty ? userSnapshot.docs[0].data().phoneNumber: "";

      const doctorDocRef = db
        .collection("Doctors")
        .where("doctorId", "==", registrationData.doctorId);
        const doctorSnapshot = await doctorDocRef.get();
        const doctorAddress = !doctorSnapshot.empty ? doctorSnapshot.docs[0].data().address: "";

      return {
        serviceRegistrationFormId: registrationData.serviceRegistrationFormId || null,
        registrationDate: registrationData.registrationDate ? registrationData.registrationDate.toDate() : null,
        doctorAddress: doctorAddress,
        address: registrationData.address || "",
        lat: registrationData.lat || "",
        lng: registrationData.lng || "",
        petName: registrationData.petName || "",
        petType: registrationData.petType || "",
        complaint: registrationData.complaint || "",
        userPhoneNumber: userPhoneNumber,
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

      let newCount = counterDoc.exists ? counterDoc.data().count + 1 : 1;
      if (counterDoc.exists) {
        await counterRef.update({ count: newCount });
      } else {
        await counterRef.set({ count: newCount });
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

      const counterRefPayment = db.collection("PaymentCounter").doc("paymentCounter");
      const counterDocPayment = await counterRefPayment.get();

      let newCountPayment = counterDocPayment.exists ? counterDocPayment.data().count + 1 : 1;
      if (counterDocPayment.exists) {
        await counterRefPayment.update({ count: newCountPayment });
      } else {
        await counterRefPayment.set({ count: newCountPayment });
      }

      const newPaymentRef = db.collection("Payments").doc();
      const newPaymentData = {
        paymentId: newCountPayment,
        paymentMethod: "",
        consultationAmount: 0,
        serviceAmount: 0,
        transportAmount: 0,
        totalAmount: 0,
        paymentStatus: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newPaymentRef.set(newPaymentData);

      const counterRefConsultation = db.collection("ConsultationCounter").doc("consultationCounter");
      const counterDocConsultation = await counterRefConsultation.get();

      let newCountConsultation = counterDocConsultation.exists ? counterDocConsultation.data().count + 1 : 1;
      if (counterDocConsultation.exists) {
        await counterRefConsultation.update({ count: newCountConsultation });
      } else {
        await counterRefConsultation.set({ count: newCountConsultation });
      }

      const newConsultationRef = db.collection("Consultations").doc();
      const newConsultationData = {
        consultationId: newCountConsultation,
        paymentId: newCountPayment,
        visitType,
        userId,
        doctorId,
        serviceRegistrationFormId: newCount,
        stageStatus: 0,
        paymentStatus: 0,
        consultationResult: "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newConsultationRef.set(newConsultationData);

      const counterRefLiveTracking = db.collection("LiveTrackingCounter").doc("liveTrackingCounter");
      const counterDocLiveTracking = await counterRefLiveTracking.get();

      let newCountLiveTracking = counterDocLiveTracking.exists ? counterDocLiveTracking.data().count + 1 : 1;
      if (counterDocLiveTracking.exists) {
        await counterRefLiveTracking.update({ count: newCountLiveTracking });
      } else {
        await counterRefLiveTracking.set({ count: newCountLiveTracking });
      }

      const newLiveTrackingRef = db.collection("LiveTrackings").doc();
      const newLiveTrackingData = {
        consultationId: newCountConsultation,
        liveTrackingId: newCountLiveTracking,
        doctorId,
        userId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newLiveTrackingRef.set(newLiveTrackingData);

      return {
        serviceRegistrationFormId: newCount,
        ...newServiceRegistrationFormData,
        paymentId: newCountPayment,
        ...newPaymentData,
        consultationId: newCountConsultation,
        ...newConsultationData,
        liveTrackingId: newCountLiveTracking,
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
