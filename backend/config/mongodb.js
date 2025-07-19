import mongoose from "mongoose";
import logModel from "../models/logModel.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    const log = new logModel({
      type: "Automated",
      description: `Database started succesfully!`,
    });
  });

  await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default connectDB;
