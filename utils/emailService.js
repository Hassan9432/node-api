// Load environment variables from .env
require("dotenv").config();

const nodemailer = require("nodemailer");

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // yourgmail@gmail.com
    pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
  },
});

// Send OTP via email
const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `"SOA App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ OTP sent to:", to);
};

module.exports = sendOTP;
