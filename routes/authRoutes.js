const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/users", auth.register);
router.post("/users/login", auth.login);
router.post("/users/forgot-password", auth.forgotPassword);
router.post("/users/verify-otp", auth.verifyOtp);
router.put("/users/reset-password", auth.resetPassword);
router.get("/users/one-user-data/:email", auth.getUserByEmail);
router.delete("/users/delete-user/:email", auth.deleteUser);
router.get("/users/get-all-users", auth.getAllUsers);
module.exports = router;
