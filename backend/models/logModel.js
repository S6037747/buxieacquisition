// User model of needed data integrated with mongoose.

import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["LoginAPI", "CompanyAPI", "Automated"],
  },
  method: {
    type: String,
    enum: ["Post", "Patch", "Delete"],
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const logModel = mongoose.models.logs || mongoose.model("log", logSchema);

export default logModel;
