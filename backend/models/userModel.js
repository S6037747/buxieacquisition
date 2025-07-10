// User model of needed data integrated with mongoose.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },

  verifyToken: { type: String, default: "" },
  verifyTokenExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },

  ResetToken: { type: String, default: "" },
  ResetTokenExpireAt: { type: Number, default: 0 },

  totpSecret: { type: String, default: "" },
  totpActive: { type: Boolean, default: false },

  role: { type: String, default: "user" },

  date: { type: Date, default: Date.now },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
