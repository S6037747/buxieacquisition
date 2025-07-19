import express from "express";
import createlog from "../controllers/logsController.js";

const logRouter = express.Router();

logRouter.post("/create", createlog);

export default logRouter;
