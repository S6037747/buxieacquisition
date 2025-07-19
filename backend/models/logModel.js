// User model of needed data integrated with mongoose.

import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["AuthAPI", "CompanyAPI", "Automated"],
  },
  method: {
    type: String,
    enum: ["Post", "Patch", "Delete", "Get"],
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const logModel = mongoose.models.logs || mongoose.model("log", logSchema);

export default logModel;
