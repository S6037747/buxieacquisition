import express from "express";
import userAuth from "../middleware/userAuth.js";

import { getAllUserData, getUserData } from "../controllers/userController.js";
import patchUser from "../controllers/auth/patchUser.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.patch("/patch", userAuth, patchUser);
userRouter.get("/all-data", userAuth, getAllUserData);

export default userRouter;
