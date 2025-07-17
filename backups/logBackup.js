import mongoose from "mongoose";
import logModel from "../backend/models/logModel.js";
import dotenv from "dotenv";

dotenv.config();

// Use your actual MongoDB URI
const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb://root:root123@mongodb:27017/database?authSource=admin&directConnection=true";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const log = new logModel({
      type: "Automated",
      description:
        "Successfully created a backup and deleted backups older than 12 weeks.",
    });

    await log.save();
    console.log("Backup log saved");
    process.exit(0);
  } catch (error) {
    console.error("Error saving backup log:", error);
    process.exit(1);
  }
};

run();
