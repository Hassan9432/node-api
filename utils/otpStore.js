const otpMemory = new Map();

const setOTP = (email, otp) => {
  otpMemory.set(email, {
    otp,
    expiry: Date.now() + 5 * 60 * 1000,
  });
};

const verifyOTP = (email, inputOtp) => {
  const data = otpMemory.get(email);
  if (!data) return false;
  if (Date.now() > data.expiry) return false;
  return data.otp === inputOtp;
};

const deleteOTP = (email) => {
  otpMemory.delete(email);
};

module.exports = { setOTP, verifyOTP, deleteOTP };
