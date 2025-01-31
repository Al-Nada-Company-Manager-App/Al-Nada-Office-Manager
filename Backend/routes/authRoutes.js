// routes/authRoutes.js
import express from "express";
import { changePassword, login, logout, getSession } from "../controllers/authController.js";

const router = express.Router();

router.post("/changepassword", changePassword);
router.post("/login", login);
router.get("/logout", logout);
router.get("/session", getSession);

export default router;
