const db = require("../firebaseAdmin");

const ServiceRegistrationFormRead = {
  getAllServiceRegistrationForms: async () => {
    try {
      const snapshot = await db.collection("ServiceRegistrationForms").orderBy("serviceRegistrationFormId", "asc").get();
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          serviceRegistrationFormId: data.serviceRegistrationFormId || null,
          serviceType: data.serviceType || "",
          registrationDate: data.registrationDate || "",
          doctorName: data.doctorName || "",
          patientName: data.patientName || "",
          phoneNumber: data.phoneNumber || "",
          complaint: data.complaint || "",
          visible: data.visible || 1,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch service registration forms");
    }
  },
  getServiceRegistrationFormById: async (serviceRegistrationFormId) => {
    try {
      const querySnapshot = await db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", parseInt(serviceRegistrationFormId)).get();
      if (querySnapshot.empty) {
        throw new Error("Service registration form not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        serviceRegistrationFormId: data.serviceRegistrationFormId || null,
        serviceType: data.serviceType || "",
        registrationDate: data.registrationDate || "",
        doctorName: data.doctorName || "",
        patientName: data.patientName || "",
        phoneNumber: data.phoneNumber || "",
        complaint: data.complaint || "",
        visible: data.visible || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch service registration form");
    }
  },
};

const ServiceRegistrationFormWrite = {
  createServiceRegistrationForm: async ({ serviceType, registrationDate, doctorName, patientName, phoneNumber, complaint }) => {
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

      const serviceRegistrationFormRef = db.collection("ServiceRegistrationForms").doc();
      const newServiceRegistrationFormData = {
        serviceRegistrationFormId: newCount,
        serviceType,
        registrationDate,
        doctorName,
        patientName,
        phoneNumber,
        complaint,
        visible: 1,
      };

      await serviceRegistrationFormRef.set(newServiceRegistrationFormData);

      return {
        serviceRegistrationFormId: newCount,
        ...newServiceRegistrationFormData,
      };
    } catch (error) {
      throw new Error("Failed to create service registration form: " + error.message);
    }
  },

  updateServiceRegistrationFormById: async (serviceRegistrationFormId, newData) => {
    try {
      const querySnapshot = await db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", parseInt(serviceRegistrationFormId)).get();
      if (querySnapshot.empty) {
        throw new Error("Service registration form not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("ServiceRegistrationForms").doc(doc.id).update(newData);
      return { msg: "Service registration form updated" };
    } catch (error) {
      throw new Error("Failed to update service registration form: " + error.message);
    }
  },

  deleteServiceRegistrationFormById: async (serviceRegistrationFormId) => {
    try {
      const querySnapshot = await db.collection("ServiceRegistrationForms").where("serviceRegistrationFormId", "==", parseInt(serviceRegistrationFormId)).get();
      if (querySnapshot.empty) {
        throw new Error("Service registration form not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("ServiceRegistrationForms").doc(doc.id).delete();
      return { msg: "Service registration form deleted" };
    } catch (error) {
      throw new Error("Failed to delete service registration form: " + error.message);
    }
  },
};

module.exports = {
  ServiceRegistrationFormRead,
  ServiceRegistrationFormWrite,
};