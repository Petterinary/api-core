const { db, auth } = require('../firebaseAdmin');

const AccountModel = {
  createAccount: async ({ email, password, username, address, phoneNumber, userType }) => {
    try {
      // Create user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      });

      const uid = userRecord.uid;

      // Incremental accountId logic
      const counterRef = db.collection("AccountCounter").doc("accountCounter");
      const counterDoc = await counterRef.get();

      let newAccountId;
      if (!counterDoc.exists) {
        await counterRef.set({ count: 1 });
        newAccountId = 1;
      } else {
        const currentCount = counterDoc.data().count || 0;
        newAccountId = currentCount + 1;
        await counterRef.update({ count: newAccountId });
      }

      // Add account data to Firestore
      const accountData = {
        accountId: newAccountId,
        email,
        username,
        address,
        phoneNumber,
        userType,
        uid, // Store the User UID from Firebase Authentication
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('Accounts').doc(String(newAccountId)).set(accountData);

      // Add user data to Users collection
      const userData = {
        userId: newAccountId,
        name: username,
        address,
        phoneNumber,
        email,
        visible: 1
      };

      await db.collection('Users').doc(String(newAccountId)).set(userData);

      return accountData;
    } catch (error) {
      throw new Error('Failed to create account: ' + error.message);
    }
  },

  getAccountById: async (accountId) => {
    try {
      const doc = await db.collection('Accounts').doc(String(accountId)).get();
      if (!doc.exists) {
        throw new Error('Account not found');
      }
      return doc.data();
    } catch (error) {
      throw new Error('Failed to fetch account: ' + error.message);
    }
  },

  updateAccountById: async (accountId, newData) => {
    try {
      const accountRef = db.collection('Accounts').doc(String(accountId));
      const doc = await accountRef.get();
      if (!doc.exists) {
        throw new Error('Account not found');
      }
      newData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      await accountRef.update(newData);
      return { msg: "Account updated" };
    } catch (error) {
      throw new Error('Failed to update account: ' + error.message);
    }
  },

  deleteAccountById: async (accountId) => {
    try {
      const accountRef = db.collection('Accounts').doc(String(accountId));
      const doc = await accountRef.get();
      if (!doc.exists) {
        throw new Error('Account not found');
      }
      await accountRef.delete();
      return { msg: "Account deleted" };
    } catch (error) {
      throw new Error('Failed to delete account: ' + error.message);
    }
  },

  getAllAccounts: async () => {
    try {
      const snapshot = await db.collection("Accounts").orderBy("accountId", "asc").get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error("Failed to fetch accounts: " + error.message);
    }
  }
};

module.exports = AccountModel;