const db = require("../firebaseAdmin");

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

// function isWithinSchedule(schedule, currentDay, currentTime) {
//   const daysMap = {
//     "Minggu": 0,
//     "Senin": 1,
//     "Selasa": 2,
//     "Rabu": 3,
//     "Kamis": 4,
//     "Jumat": 5,
//     "Sabtu": 6
//   };

//   const [daysPart, timePart] = schedule.split(": ");
//   const [startDay, endDay] = daysPart.split(" - ");
//   const [startTime, endTime] = timePart.split(" - ");

//   const startDayIndex = daysMap[startDay];
//   const endDayIndex = daysMap[endDay];
//   const startTimeParts = startTime.split(":");
//   const endTimeParts = endTime.split(":");
//   const currentTimeParts = currentTime.split(":");

//   const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
//   const endMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);
//   const currentMinutes = parseInt(currentTimeParts[0]) * 60 + parseInt(currentTimeParts[1]);

//   const isDayWithinRange = (startDayIndex <= endDayIndex)
//     ? (currentDay >= startDayIndex && currentDay <= endDayIndex)
//     : (currentDay >= startDayIndex || currentDay <= endDayIndex);

//   const isTimeWithinRange = (endMinutes >= startMinutes)
//     ? (currentMinutes >= startMinutes && currentMinutes <= endMinutes)
//     : (currentMinutes >= startMinutes || currentMinutes <= endMinutes);

//   return isDayWithinRange && isTimeWithinRange;
// }

const DoctorRead = {
  getAllDoctors: async (userLat, userLng) => {
    try {
      const snapshot = await db
        .collection("Doctors")
        .where("visible", "==", 1)
        .orderBy("doctorId", "asc")
        .get();

      const currentDay = new Date().getDay();
      const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const accountSnapshot = await db
            .collection("Accounts")
            .where("doctorId", "==", data.doctorId)
            .get();
          const accountData = accountSnapshot.empty
            ? {}
            : accountSnapshot.docs[0].data();

          let distance = null;

          if (accountData.lat && accountData.lng) {
            distance = calculateDistance(userLat, userLng, accountData.lat, accountData.lng);
          }

          // const isAvailable = isWithinSchedule(data.doctorSchedule, currentDay, currentTime);

          // if (isAvailable) {
            return {
              doctorId: data.doctorId || null,
              name: accountData.username || data.name || "",
              phoneNumber: data.phoneNumber || "",
              address: data.address || "",
              email: data.email || "",
              specialization: data.specialization || "",
              doctorSchedule: data.doctorSchedule || "",
              experience: data.experience || "",
              gender: accountData.gender || "",
              lat: accountData.lat || "",
              lng: accountData.lng || "",
              visible: data.visible || 1,
              distance: distance !== null ? Number(distance.toFixed(2)) : null,
            };
          // } else {
          //   return null;
          // }
        })
      );

      return list.filter(doctor => doctor !== null);
    } catch (error) {
      throw new Error("Failed to fetch doctors: " + error.message);
    }
  },

  getDoctorById: async (doctorId) => {
    try {
      const querySnapshot = await db
        .collection("Doctors")
        .where("doctorId", "==", parseInt(doctorId))
        .where("visible", "==", 1)
        .get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const accountSnapshot = await db
        .collection("Accounts")
        .where("doctorId", "==", data.doctorId)
        .get();
      const accountData = accountSnapshot.empty
        ? {}
        : accountSnapshot.docs[0].data();
      return {
        doctorId: data.doctorId || null,
        name: accountData.username || data.name || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        email: data.email || "",
        specialization: data.specialization || "",
        doctorSchedule: data.doctorSchedule || "",
        experience: data.experience || "",
        gender: accountData.gender || "",
        lat: accountData.lat || "",
        lng: accountData.lng || "",
        visible: data.visible || 1,
      };
    } catch (error) {
      throw new Error("Failed to fetch doctor: " + error.message);
    }
  },
};

const DoctorWrite = {
  createDoctor: async ({
    name,
    phoneNumber,
    address,
    email = "",
    specialization = "",
    lat,
    lng,
  }) => {
    try {
      const counterRef = db.collection("DoctorCounter").doc("doctorCounter");
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

      const newDoctorRef = db.collection("Doctors").doc();
      const newDoctorData = {
        doctorId: newCount,
        name,
        phoneNumber,
        address,
        email,
        specialization,
        lat,
        lng,
        visible: 1, // Set visibility to 1 for new doctors
      };

      await newDoctorRef.set(newDoctorData);

      return {
        doctorId: newCount,
        ...newDoctorData,
      };
    } catch (error) {
      throw new Error("Failed to create doctor: " + error.message);
    }
  },

  updateDoctorById: async (doctorID, newData) => {
    try {
      const querySnapshot = await db
        .collection("Doctors")
        .where("doctorId", "==", parseInt(doctorID))
        .get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Doctors").doc(doc.id).update(newData);
      return { msg: "Doctor updated" };
    } catch (error) {
      throw new Error("Failed to update doctor: " + error.message);
    }
  },

  deleteDoctorById: async (doctorID) => {
    try {
      const querySnapshot = await db
        .collection("Doctors")
        .where("doctorId", "==", parseInt(doctorID))
        .get();
      if (querySnapshot.empty) {
        throw new Error("Doctor not found");
      }
      const doc = querySnapshot.docs[0];
      await db.collection("Doctors").doc(doc.id).update({ visible: 0 }); // Update visibility to 0 instead of deleting
      return { msg: "Doctor hidden" };
    } catch (error) {
      throw new Error("Failed to hide doctor: " + error.message);
    }
  },
};

module.exports = {
  DoctorRead,
  DoctorWrite,
};