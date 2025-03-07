import express from "express";
import { getProfile, createAdmin } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// 📌 RESTful: Obtener perfil del usuario autenticado (GET /api/users/me)
router.route("/me").get(authenticate, getProfile);

// 📌 RESTful: Crear un nuevo administrador (POST /api/users/admin)
router.route("/admin").post(authenticate, authorizeAdmin, createAdmin);

export default router;
