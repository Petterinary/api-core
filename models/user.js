const db = require("../config");

const UserRead = {
  getAllUsers: async () => {
    try {
      const snapshot = await db.collection("Users").get();
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return list;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  },
  getUserById: async (userID) => {
    try {
      const doc = await db.collection("Users").doc(userID).get();
      if (!doc.exists) {
        throw new Error("User not found");
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },
};

const UserWrite = {
  createUser: async ({ name, phoneNumber, address, email = "" }) => {
    try {
      const docRef = await db.collection("Users").add({
        name,
        phoneNumber,
        address,
        email,
      });

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Failed to create user");
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  updateUserById: async (userID, newData) => {
    try {
      await db.collection("Users").doc(userID).update(newData);
      return { msg: "User updated" };
    } catch (error) {
      throw new Error("Failed to update user");
    }
  },

  deleteUserById: async (userID) => {
    try {
      await db.collection("Users").doc(userID).delete();
      return { msg: "User deleted" };
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  },
};

module.exports = {
    UserRead,
    UserWrite
};