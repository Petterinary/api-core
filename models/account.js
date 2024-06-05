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
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } catch (error) {
      throw new Error("Failed to fetch account: " + error.message);
    }
  },
};

const AccountWrite = {
  createAccount: async ({ email, username, address, phoneNumber, userType, uid }) => {
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