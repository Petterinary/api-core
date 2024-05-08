const User = require("../models/user");

const getAllUsers = async (req, res) => {
  const users = await User.UserRead.getAllUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  const { userID } = req.params;
  const user = await User.UserRead.getUserById(userID);
  res.json(user);
};

const createUser = async (req, res) => {
  const { name, phoneNumber, address, email = "" } = req.body;
  const newUser = await User.UserWrite.createUser({ name, phoneNumber, address, email });
  res.status(201).json(newUser);
};

const updateUserById = async (req, res) => {
  const { userID } = req.params;
  const { name, phoneNumber, address, email = "" } = req.body;
  const updatedUser = await User.UserWrite.updateUserById(userID, { name, phoneNumber, address, email });
  res.json(updatedUser);
};

const deleteUserById = async (req, res) => {
  const { userID } = req.params;
  await User.UserWrite.deleteUserById(userID);
  res.json({ message: "User deleted successfully" });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};