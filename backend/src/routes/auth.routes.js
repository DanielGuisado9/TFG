import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { createAdmin } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/admin", authenticate, createAdmin); // Solo el Super Admin puede hacer esto
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
