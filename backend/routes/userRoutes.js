import express from "express";
import userAuth from "../middleware/userAuth.js";

import { getAllUserData, getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/all-data", userAuth, getAllUserData);

export default userRouter;
