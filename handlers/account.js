const AccountModel = require('../models/account');

const accountHandler = {
  createAccount: async (req, res) => {
    try {
      const { email, password, username, address, phoneNumber, userType } = req.body;
      const newAccount = await AccountModel.createAccount({ email, password, username, address, phoneNumber, userType });
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAccountById: async (req, res) => {
    try {
      const { accountId } = req.params;
      const account = await AccountModel.getAccountById(accountId);
      res.status(200).json(account);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  updateAccountById: async (req, res) => {
    try {
      const { accountId } = req.params;
      const newData = req.body;
      const updatedAccount = await AccountModel.updateAccountById(accountId, newData);
      res.json(updatedAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteAccountById: async (req, res) => {
    try {
      const { accountId } = req.params;
      await AccountModel.deleteAccountById(accountId);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const accounts = await AccountModel.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = accountHandler;