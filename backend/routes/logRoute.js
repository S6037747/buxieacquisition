import express from "express";
import { createlog, getLogs } from "../controllers/logsController.js";
import userAuth from "../middleware/userAuth.js";

const logRouter = express.Router();

logRouter.post("/create", createlog);
logRouter.get("", userAuth, getLogs);

export default logRouter;
