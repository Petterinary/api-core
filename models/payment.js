const db = require("../firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

const PaymentRead = {
  getAllPayments: async () => {
    try {
      const snapshot = await db.collection("Payments")
        .orderBy("paymentId", "asc")
        .get();
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          paymentId: data.paymentId || null,
          paymentMethod: data.paymentMethod || "",
          consultationAmount: data.consultationAmount || 0,
          serviceAmount: data.serviceAmount || 0,
          transportAmount: data.transportAmount || 0,
          totalAmount: data.totalAmount || 0,
          paymentStatus: data.paymentStatus || 0,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch payments: " + error.message);
    }
  },
  getPaymentById: async (paymentId) => {
    try {
      const querySnapshot = await db.collection("Payments")
        .where("paymentId", "==", Number(paymentId))
        .get();
      if (querySnapshot.empty) {
        throw new Error("Payment not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        paymentId: data.paymentId || null,
        paymentMethod: data.paymentMethod || "",
        consultationAmount: data.consultationAmount || 0,
        serviceAmount: data.serviceAmount || 0,
        transportAmount: data.transportAmount || 0,
        totalAmount: data.totalAmount || 0,
        paymentStatus: data.paymentStatus || 0,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } catch (error) {
      throw new Error("Failed to fetch payment");
    }
  },
};

const PaymentWrite = {
  createPayment: async ({ consultationAmount, serviceAmount }) => {
    try {
      const counterRef = db.collection("PaymentCounter").doc("paymentCounter");
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

      const totalAmount = parseInt(consultationAmount) + parseInt(serviceAmount) + parseInt(transportAmount);

      const newPaymentRef = db.collection("Payments").doc();
      const newPaymentData = {
        paymentId: newCount,
        paymentMethod: "",
        consultationAmount: parseInt(consultationAmount),
        serviceAmount: parseInt(serviceAmount),
        transportAmount: parseInt(transportAmount),
        totalAmount,
        paymentStatus: 0,
        visible: 1,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newPaymentRef.set(newPaymentData);

      return {
        paymentId: newCount,
        ...newPaymentData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      throw new Error("Failed to create payment: " + error.message);
    }
  },

  updatePaymentById: async (paymentId, newData) => {
    try {
      const paymentSnapshot = await db
        .collection("Payments")
        .where("paymentId", "==", parseInt(paymentId))
        .get();

      if (paymentSnapshot.empty) {
        throw new Error("Payment not found");
      }

      const paymentDoc = paymentSnapshot.docs[0];
      const paymentData = paymentDoc.data();

      const consultationAmount = parseInt(newData.consultationAmount ?? paymentData.consultationAmount ?? 0);
      const serviceAmount = parseInt(newData.serviceAmount ?? paymentData.serviceAmount ?? 0);
      const transportAmount = parseInt(newData.transportAmount ?? paymentData.transportAmount ?? 0);
      const totalAmount = consultationAmount + serviceAmount + transportAmount;

      newData.updatedAt = FieldValue.serverTimestamp();
      newData.totalAmount = totalAmount;

      await db.collection("Payments").doc(paymentDoc.id).update(newData);

      if (newData.paymentStatus === 2) {
        const consultationSnapshot = await db
          .collection("Consultations")
          .where("paymentId", "==", parseInt(paymentId))
          .get();

        if (!consultationSnapshot.empty) {
          const consultationDoc = consultationSnapshot.docs[0];
          await db.collection("Consultations").doc(consultationDoc.id).update({
            stageStatus: 3,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      return { msg: "Payment updated" };
    } catch (error) {
      throw new Error("Failed to update payment: " + error.message);
    }
  },

  deletePaymentById: async (paymentID) => {
    try {
      const querySnapshot = await db.collection("Payments").where("paymentId", "==", parseInt(paymentID)).get();
      if (querySnapshot.empty) {
        throw new Error("Payment not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Payments").doc(doc.id).update({ visible: 0, updatedAt: FieldValue.serverTimestamp() });
      return { msg: "Payment hidden" };
    } catch (error) {
      throw new Error("Failed to hide payment: " + error.message);
    }
  },
};

module.exports = {
  PaymentRead,
  PaymentWrite
};