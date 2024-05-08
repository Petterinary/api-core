const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCJpuZdn5dXqbUYdybDLsbGEv9yptdQ4kU",
  authDomain: "petterinary-d36f0.firebaseapp.com",
  projectId: "petterinary-d36f0",
  storageBucket: "petterinary-d36f0.appspot.com",
  messagingSenderId: "821654324244",
  appId: "1:821654324244:web:a131b32e3d5da3d7aad301",
  measurementId: "G-WJ98JRG696"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;
