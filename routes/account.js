const express = require("express");
const router = express.Router();
const accountHandlers = require("../handlers/account");

router.get("/", accountHandlers.getAllAccounts);
router.get("/:accountId", accountHandlers.getAccountById);
router.post("/create", accountHandlers.createAccount);
router.patch("/update/:accountId", accountHandlers.updateAccountById);
router.delete("/delete/:accountId", accountHandlers.deleteAccountById);

module.exports = router;