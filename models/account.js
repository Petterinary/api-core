const db = require("../firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

const AccountRead = {
  getAllAccounts: async () => {
    try {
      const snapshot = await db.collection("Accounts").orderBy("accountId", "asc").get();
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          accountId: data.accountId || null,
          email: data.email || "",
          username: data.username || "",
          address: data.address || "",
          phoneNumber: data.phoneNumber || "",
          userType: data.userType || "",
          uid: data.uid || "",
          lat: data.lat || "",
          lng: data.lng || "",
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch accounts: " + error.message);
    }
  },

  getAccountById: async (accountId) => {
    try {
      const querySnapshot = await db.collection("Accounts").where("accountId", "==", parseInt(accountId)).get();
      if (querySnapshot.empty) {
        throw new Error("Account not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        accountId: data.accountId || null,
        email: data.email || "",
        username: data.username || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        userType: data.userType || "",
        uid: data.uid || "",
        lat: data.lat || "",
        lng: data.lng || "",
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } catch (error) {
      throw new Error("Failed to fetch account: " + error.message);
    }
  },

  getDoctorById: async (doctorId) => {
    try {
      const querySnapshot = await db.collection("Doctors").where("doctorId", "==", parseInt(doctorId)).get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        doctorId: data.doctorId || null,
        name: data.name || "",
        address: data.address || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        specialization: data.specialization || "",
        doctorSchedule: data.doctorSchedule || "",
        experience: data.experience || "",
        lat: data.lat || "",
        lng: data.lng || "",
      };
    } catch (error) {
      throw new Error("Failed to fetch doctor: " + error.message);
    }
  },

  getAccountByUid: async (uid) => {
    try {
      const querySnapshot = await db.collection("Accounts").where("uid", "==", uid).get();
      if (querySnapshot.empty) {
        throw new Error("Account not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        accountId: data.accountId || null,
        email: data.email || "",
        username: data.username || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        userType: data.userType || "",
        uid: data.uid || "",
        lat: data.lat || "",
        lng: data.lng || "",
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } catch (error) {
      throw new Error("Failed to fetch account: " + error.message);
    }
  },
};

const AccountWrite = {
  createAccount: async ({ email, username, address, phoneNumber, userType, uid, gender, lat, lng }) => {
    try {
      const counterRef = db.collection("AccountCounter").doc("accountCounter");
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

      const newAccountRef = db.collection("Accounts").doc();
      const newAccountData = {
        accountId: newCount,
        email,
        username,
        address,
        phoneNumber,
        userType,
        uid,
        gender,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newAccountRef.set(newAccountData);

      return {
        accountId: newCount,
        ...newAccountData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to create account: " + error.message);
    }
  },

  createUserAccount: async ({ email, username, address, phoneNumber, userType, uid, gender, lat, lng }) => {
    try {
      const accountCounterRef = db.collection("AccountCounter").doc("accountCounter");
      const accountCounterDoc = await accountCounterRef.get();

      let newAccountId;
      if (!accountCounterDoc.exists) {
        await accountCounterRef.set({ count: 1 });
        newAccountId = 1;
      } else {
        const currentCount = accountCounterDoc.data().count || 0;
        newAccountId = currentCount + 1;
        await accountCounterRef.update({ count: newAccountId });
      }

      const userCounterRef = db.collection("UserCounter").doc("userCounter");
      const userCounterDoc = await userCounterRef.get();

      let newUserId;
      if (!userCounterDoc.exists) {
        await userCounterRef.set({ count: 1 });
        newUserId = 1;
      } else {
        const currentCount = userCounterDoc.data().count || 0;
        newUserId = currentCount + 1;
        await userCounterRef.update({ count: newUserId });
      }

      const newAccountRef = db.collection("Accounts").doc();
      const newAccountData = {
        accountId: newAccountId,
        email,
        username,
        address,
        phoneNumber,
        userType,
        uid,
        gender,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        userId: newUserId,
      };

      const newUserRef = db.collection("Users").doc();
      const newUserData = {
        userId: newUserId,
        email,
        username,
        address,
        phoneNumber,
        gender,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newAccountRef.set(newAccountData);
      await newUserRef.set(newUserData);

      return {
        accountId: newAccountId,
        ...newAccountData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to create user account: " + error.message);
    }
  },

  createDoctorAccount: async ({ email, username, address, phoneNumber, userType, uid, doctorSchedule, experience, specialization, gender, lat, lng }) => {
    try {
      const accountCounterRef = db.collection("AccountCounter").doc("accountCounter");
      const accountCounterDoc = await accountCounterRef.get();

      let newAccountId;
      if (!accountCounterDoc.exists) {
        await accountCounterRef.set({ count: 1 });
        newAccountId = 1;
      } else {
        const currentCount = accountCounterDoc.data().count || 0;
        newAccountId = currentCount + 1;
        await accountCounterRef.update({ count: newAccountId });
      }

      const doctorCounterRef = db.collection("DoctorCounter").doc("doctorCounter");
      const doctorCounterDoc = await doctorCounterRef.get();

      let newDoctorId;
      if (!doctorCounterDoc.exists) {
        await doctorCounterRef.set({ count: 1 });
        newDoctorId = 1;
      } else {
        const currentCount = doctorCounterDoc.data().count || 0;
        newDoctorId = currentCount + 1;
        await doctorCounterRef.update({ count: newDoctorId });
      }

      const newAccountRef = db.collection("Accounts").doc();
      const newAccountData = {
        accountId: newAccountId,
        email,
        username,
        address,
        phoneNumber,
        userType,
        uid,
        gender,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        doctorId: newDoctorId,
      };

      const newDoctorRef = db.collection("Doctors").doc();
      const newDoctorData = {
        doctorId: newDoctorId,
        name: username,
        address,
        email,
        phoneNumber,
        specialization,
        doctorSchedule,
        experience,
        gender,
        lat,
        lng,
        visible: 1,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await newAccountRef.set(newAccountData);
      await newDoctorRef.set(newDoctorData);

      return {
        accountId: newAccountId,
        doctorId: newDoctorId,
        email,
        username,
        address,
        phoneNumber,
        userType,
        uid,
        doctorSchedule,
        experience,
        specialization,
        gender,
        lat,
        lng,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to create doctor account: " + error.message);
    }
  },

  updateAccountById: async (accountId, newData) => {
    try {
      const querySnapshot = await db.collection("Accounts").where("accountId", "==", parseInt(accountId)).get();
      if (querySnapshot.empty) {
        throw new Error("Account not found");
      }
      const doc = querySnapshot.docs[0];

      newData.updatedAt = FieldValue.serverTimestamp();

      await db.collection("Accounts").doc(doc.id).update(newData);
      return { msg: "Account updated" };
    } catch (error) {
      throw new Error("Failed to update account: " + error.message);
    }
  },

  deleteAccountById: async (accountId) => {
    try {
      const querySnapshot = await db.collection("Accounts").where("accountId", "==", parseInt(accountId)).get();
      if (querySnapshot.empty) {
        throw new Error("Account not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Accounts").doc(doc.id).delete();
      return { msg: "Account deleted" };
    } catch (error) {
      throw new Error("Failed to delete account: " + error.message);
    }
  },
};

module.exports = {
  AccountRead,
  AccountWrite,
};