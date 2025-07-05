// User model of needed data integrated with mongoose.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyToken: { type: String, default: "" },
  verifyTokenExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  ResetToken: { type: String, default: "" },
  ResetTokenExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
