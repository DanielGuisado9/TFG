import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { createAdmin } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📌 RESTful: Registro y autenticación
router.route("/register").post(register); // Registrar usuario
router.route("/login").post(login); // Iniciar sesión

// 📌 RESTful: Recuperación de contraseña
router.route("/forgot-password").post(forgotPassword); // Solicitar recuperación de contraseña
router.route("/reset-password").post(resetPassword); // Resetear contraseña

// 📌 RESTful: Creación de administradores (solo Super Admin)
router.route("/admin").post(authenticate, createAdmin); 

export default router;
