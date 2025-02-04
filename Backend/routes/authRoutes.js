// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/changepassword", authController.changePassword);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/session", authController.getSession);

export default router;
