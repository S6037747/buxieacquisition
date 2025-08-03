import express from "express";

// Import controller functions (you would create these)
import getCompanyData from "../controllers/company/getCompanyData.js";
import postCompanyData from "../controllers/company/postCompanyData.js";
import patchCompanyData from "../controllers/company/patchCompanyData.js";
import deleteCompanyData from "../controllers/company/deleteCompanyData.js";
import deleteComment from "../controllers/company/deleteComment.js";
import getUserData from "../controllers/company/getUserData.js";
import postComment from "../controllers/company/postComment.js";
import postInteraction from "../controllers/company/postInteraction.js";
import deleteInteraction from "../controllers/company/deleteInteraction.js";
import userAuth from "../middleware/userAuth.js";
import postReminder from "../controllers/company/postReminders.js";
import patchReminder from "../controllers/company/patchReminders.js";
import deleteReminder from "../controllers/company/deleteReminder.js";
import postProgress from "../controllers/company/postProgress.js";

const CompanyRouter = express.Router();

// Main data
CompanyRouter.get("/data/:id", userAuth, getCompanyData);
CompanyRouter.get("/data", userAuth, getCompanyData);
CompanyRouter.get("/data/user/:id", userAuth, getUserData);
CompanyRouter.post("/data", userAuth, postCompanyData);
CompanyRouter.post("/comment", userAuth, postComment);
CompanyRouter.post("/interaction", userAuth, postInteraction);
CompanyRouter.post("/reminder", userAuth, postReminder);
CompanyRouter.post("/progress", userAuth, postProgress);
CompanyRouter.patch("/data", userAuth, patchCompanyData);
CompanyRouter.patch("/reminder", userAuth, patchReminder);
CompanyRouter.delete("/data", userAuth, deleteCompanyData);
CompanyRouter.delete("/comment", userAuth, deleteComment);
CompanyRouter.delete("/interaction", userAuth, deleteInteraction);
CompanyRouter.delete("/reminder", userAuth, deleteReminder);

export default CompanyRouter;
