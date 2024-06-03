const db = require("../firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

const PaymentRead = {
  getAllPayments: async () => {
    try {
      const snapshot = await db.collection("Payments")
        .where("visible", "==", 1)
        .orderBy("paymentId", "asc")
        .get();
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          paymentId: data.paymentId || null,
          paymentMethod: data.paymentMethod || "",
          consultationAmount: data.consultationAmount || 0,
          serviceAmount: data.serviceAmount || 0,
          totalAmount: data.totalAmount || 0,
          paymentStatus: data.paymentStatus || 0,
          visible: data.visible || 1,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch payments: " + error.message);
    }
  },
  getPaymentById: async (paymentID) => {
    try {
      const querySnapshot = await db.collection("Payments")
        .where("paymentId", "==", parseInt(paymentID))
        .where("visible", "==", 1)
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
        totalAmount: data.totalAmount || 0,
        paymentStatus: data.paymentStatus || 0,
        visible: data.visible || 1,
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

      const totalAmount = parseInt(consultationAmount) + parseInt(serviceAmount);

      const newPaymentRef = db.collection("Payments").doc();
      const newPaymentData = {
        paymentId: newCount,
        paymentMethod: "",
        consultationAmount: parseInt(consultationAmount),
        serviceAmount: parseInt(serviceAmount),
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

  updatePaymentById: async (paymentID, newData) => {
    try {
      const querySnapshot = await db.collection("Payments").where("paymentId", "==", parseInt(paymentID)).get();
      if (querySnapshot.empty) {
        throw new Error("Payment not found");
      }
      const doc = querySnapshot.docs[0];

      if (newData.consultationAmount !== undefined && newData.serviceAmount !== undefined) {
        newData.totalAmount = parseInt(newData.consultationAmount) + parseInt(newData.serviceAmount);
      }

      newData.updatedAt = FieldValue.serverTimestamp();

      // Filter out undefined values
      const validData = Object.fromEntries(Object.entries(newData).filter(([_, v]) => v !== undefined));

      await db.collection("Payments").doc(doc.id).update(validData);

      // Fetch the updated document
      const updatedDoc = await db.collection("Payments").doc(doc.id).get();
      const updatedData = updatedDoc.data();

      return {
        msg: "Payment updated",
        updatedAt: updatedData.updatedAt ? updatedData.updatedAt.toDate() : null
      };
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