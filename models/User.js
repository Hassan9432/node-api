const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    _id: Number, // Auto-increment integer ID
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

userSchema.plugin(AutoIncrement, {
  id: "user_seq",
  inc_field: "_id",
  start_seq: 1,
});

module.exports = mongoose.model("User", userSchema);
