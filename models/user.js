const db = require("../firebaseAdmin");

const UserRead = {
  getAllUsers: async () => {
    try {
      const snapshot = await db
        .collection("Users")
        .where("visible", "==", 1)
        .orderBy("userId", "asc")
        .get();
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId || null,
          name: data.name || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          email: data.email || "",
          lat: data.lat || "",
          lng: data.lng || "",
          visible: data.visible || 1,
        };
      });
      return list;
    } catch (error) {
      throw new Error("Failed to fetch users: " + error.message);
    }
  },

  getUserById: async (userID) => {
    try {
      const querySnapshot = await db
        .collection("Users")
        .where("userId", "==", parseInt(userID))
        .where("visible", "==", 1)
        .get();
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        userId: data.userId || null,
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        email: data.email || "",
        lat: data.lat || "",
        lng: data.lng || "",
        visible: data.visible || 1,
      };
    } catch (error) {
      throw new Error("Failed to fetch User");
    }
  },
};

const UserWrite = {
  createUser: async ({ name, phoneNumber, address, email = "", lat, lng }) => {
    try {
      const counterRef = db.collection("UserCounter").doc("userCounter");
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

      const newUserRef = db.collection("Users").doc();
      const newUserData = {
        userId: newCount,
        name,
        phoneNumber,
        address,
        email,
        lat,
        lng,
        visible: 1,
      };

      await newUserRef.set(newUserData);

      return {
        userId: newCount,
        ...newUserData,
      };
    } catch (error) {
      throw new Error("Failed to create user: " + error.message);
    }
  },

  updateUserById: async (userID, newData) => {
    try {
      const querySnapshot = await db
        .collection("Users")
        .where("userId", "==", parseInt(userID))
        .get();
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Users").doc(doc.id).update(newData);
      return { msg: "User updated" };
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  },

  deleteUserById: async (userID) => {
    try {
      const querySnapshot = await db
        .collection("Users")
        .where("userId", "==", parseInt(userID))
        .get();
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Users").doc(doc.id).update({ visible: 0 });
      return { msg: "User hidden" };
    } catch (error) {
      throw new Error("Failed to hide user: " + error.message);
    }
  },
};

module.exports = {
  UserRead,
  UserWrite,
};