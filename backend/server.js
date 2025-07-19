import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import CompanyRouter from "./routes/companyRoutes.js";
import "./jobs/reminderNotifier.js";
import logRouter from "./routes/logRoute.js";
import logModel from "./models/logModel.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.178.234:5173",
  "https://app.buixie.nl",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// API Endpoints
app.get("/", (req, res) => res.send("API is Working"));

app.use("/api/auth", authRouter);
app.use("/api/user", UserRouter);
app.use("/api/company", CompanyRouter);
app.use("/api/log", logRouter);

app.listen(port, "0.0.0.0", async () => {
  const log = new logModel({
    type: "Automated",
    description: `Server started on PORT:${port}`,
  });

  await log.save();
});
