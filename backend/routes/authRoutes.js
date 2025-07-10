import express from "express";
import register from "../controllers/auth/register.js";
import login from "../controllers/auth/login.js";
import logout from "../controllers/auth/logout.js";
import isAuthenticated from "../controllers/auth/isAuthenticated.js";
import sendResetToken from "../controllers/auth/sendResetToken.js";
import resetPassword from "../controllers/auth/resetPassword.js";
import userAuth from "../middleware/userAuth.js";
import invite from "../controllers/auth/sendInvite.js";
import deleteUser from "../controllers/auth/delete.js";
import admin from "../controllers/auth/admin.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/invite", userAuth, invite);
authRouter.post("/admin", userAuth, admin);
authRouter.post("/delete", userAuth, deleteUser);
authRouter.get("/verify-auth", userAuth, isAuthenticated);
authRouter.post("/request-reset-token", sendResetToken);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
