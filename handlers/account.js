const Account = require("../models/account");

const convertToIndonesianTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.AccountRead.getAllAccounts();
    const convertedAccounts = accounts.map(acc => ({
      ...acc,
      createdAt: acc.createdAt ? convertToIndonesianTime(acc.createdAt) : null,
      updatedAt: acc.updatedAt ? convertToIndonesianTime(acc.updatedAt) : null,
    }));
    res.json(convertedAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccountById = async (req, res) => {
  const { accountId } = req.params;
  try {
    const account = await Account.AccountRead.getAccountById(accountId);
    const convertedAccount = {
      ...account,
      createdAt: account.createdAt ? convertToIndonesianTime(account.createdAt) : null,
      updatedAt: account.updatedAt ? convertToIndonesianTime(account.updatedAt) : null,
    };
    res.json(convertedAccount);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doctor = await Account.AccountRead.getDoctorById(doctorId);
    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAccountByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    const account = await Account.AccountRead.getAccountByUid(uid);
    const convertedAccount = {
      ...account,
      createdAt: account.createdAt ? convertToIndonesianTime(account.createdAt) : null,
      updatedAt: account.updatedAt ? convertToIndonesianTime(account.updatedAt) : null,
    };
    res.json(convertedAccount);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createAccount = async (req, res) => {
  const { email, username, address, phoneNumber, userType, uid, gender, lat, lng } = req.body;
  if (!email || !username || !address || !phoneNumber || !userType || !uid || !gender || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newAccount = await Account.AccountWrite.createAccount({
      email,
      username,
      address,
      phoneNumber,
      userType,
      uid,
      gender,
      lat,
      lng,
    });
    const convertedAccount = {
      ...newAccount,
      createdAt: newAccount.createdAt ? convertToIndonesianTime(newAccount.createdAt) : null,
      updatedAt: newAccount.updatedAt ? convertToIndonesianTime(newAccount.updatedAt) : null,
    };
    res.status(201).json(convertedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDoctorAccount = async (req, res) => {
  const { email, username, address, phoneNumber, userType, uid, doctorSchedule, experience, specialization, gender, lat, lng } = req.body;
  if (!email || !username || !address || !phoneNumber || !userType || !uid || !doctorSchedule || !experience || !specialization || !gender || !lat || !lng ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newDoctorAccount = await Account.AccountWrite.createDoctorAccount({
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
    });
    const convertedDoctorAccount = {
      ...newDoctorAccount,
      createdAt: newDoctorAccount.createdAt ? convertToIndonesianTime(newDoctorAccount.createdAt) : null,
      updatedAt: newDoctorAccount.updatedAt ? convertToIndonesianTime(newDoctorAccount.updatedAt) : null,
    };
    res.status(201).json(convertedDoctorAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccountById = async (req, res) => {
  const { accountId } = req.params;
  const newData = req.body;
  try {
    const updatedAccount = await Account.AccountWrite.updateAccountById(accountId, newData);
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccountById = async (req, res) => {
  const { accountId } = req.params;
  try {
    await Account.AccountWrite.deleteAccountById(accountId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAccounts,
  getAccountById,
  getDoctorById,
  getAccountByUid,
  createAccount,
  createDoctorAccount,
  updateAccountById,
  deleteAccountById,
};