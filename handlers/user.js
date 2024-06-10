const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.UserRead.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.UserRead.getUserById(userID);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const {
    name,
    phoneNumber,
    address,
    email = "",
    specialization = "",
    lat,
    lng,
  } = req.body;
  try {
    const newUser = await User.UserWrite.createUser({
      name,
      phoneNumber,
      address,
      email,
      specialization,
      lat,
      lng,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserById = async (req, res) => {
  const { userID } = req.params;
  const {
    name,
    phoneNumber,
    address,
    email = "",
    specialization = "",
    lat,
    lng,
  } = req.body;
  try {
    const updatedUser = await User.UserWrite.updateUserById(userID, {
      name,
      phoneNumber,
      address,
      email,
      specialization,
      lat,
      lng,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { userID } = req.params;
  try {
    await User.UserWrite.deleteUserById(userID);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
