const express = require("express");
const router = express.Router();
const userHandlers = require("../handlers/user");

router.get("/", userHandlers.getAllUsers);
router.get("/:userID", userHandlers.getUserById);
router.post("/create", userHandlers.createUser);
router.patch("/update/:userID", userHandlers.updateUserById);
router.delete("/delete/:userID", userHandlers.deleteUserById);

module.exports = router;