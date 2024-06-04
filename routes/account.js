const express = require('express');
const accountHandler = require('../handlers/account');

const router = express.Router();

router.post('/accounts', accountHandler.createAccount);
router.get('/accounts/:accountId', accountHandler.getAccountById);
router.patch('/accounts/:accountId', accountHandler.updateAccountById);
router.delete('/accounts/:accountId', accountHandler.deleteAccountById);
router.get('/accounts', accountHandler.getAllAccounts);

module.exports = router;