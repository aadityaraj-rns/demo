const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: true },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.userType === "admin" || this.userType === "organization") {
            return !!value; // Password is required for "admin" and "organization"
          }
          return true; // Password is optional for other user types
        },
        message:
          'Password is required when userType is "admin" or "organization".',
      },
    },
    profile: { type: String, required: false },
    loginID: { type: String, required: false },
    displayName: { type: String, required: false },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
    otp: { type: String, required: false },
    otpExpiry: { type: String, required: false },
    deviceToken: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "users");
