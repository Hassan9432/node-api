const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendOTP = require("../utils/emailService");
const { setOTP, verifyOTP, deleteOTP } = require("../utils/otpStore");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });

    await user.save();
    res.json({ message: "User registered" });
  } catch (e) {
    console.error("Register Error:", e);
    res.status(400).json({ error: "Email already exists or invalid input" });
  }
};

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid password" });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ message: "Login successful", token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp);

  res.json({ message: "OTP sent to email" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp === null || user.otp !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });
  deleteOTP(email);
  res.json({ message: "Password updated successfully" });
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
};

exports.deleteUser = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User with email ${email} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteByID = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v"); // Exclude password & __v
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getAllUsersById = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v"); // Exclude password & __v
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
