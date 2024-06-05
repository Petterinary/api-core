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

const createAccount = async (req, res) => {
  const { email, username, address, phoneNumber, userType, uid } = req.body;
  if (!email || !username || !address || !phoneNumber || !userType || !uid) {
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
  createAccount,
  updateAccountById,
  deleteAccountById,
};