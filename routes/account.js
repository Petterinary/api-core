const express = require("express");
const router = express.Router();
const accountHandlers = require("../handlers/account");

router.get("/", accountHandlers.getAllAccounts);
router.get("/:accountId", accountHandlers.getAccountById);
router.get("/uid/:uid", accountHandlers.getAccountByUid);
router.get("/doctor/:doctorId", accountHandlers.getDoctorById);
router.post("/create", accountHandlers.createAccount);
router.post("/createDoctorAccount", accountHandlers.createDoctorAccount);
router.post("/createUserAccount", accountHandlers.createUserAccount);
router.patch("/update/:accountId", accountHandlers.updateAccountById);
router.delete("/delete/:accountId", accountHandlers.deleteAccountById);

module.exports = router;