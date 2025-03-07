import express from "express";
import { createCita, getCitas, getTodasLasCitas, cancelarCita } from "../controllers/citas.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📌 RESTful: Rutas para usuarios
router.route("/").post(authenticate, createCita); // Crear cita
router.route("/").get(authenticate, getCitas); // Obtener citas del usuario autenticado
router.route("/:id").delete(authenticate, cancelarCita); // Cancelar cita

// 📌 RESTful: Rutas para administradores
router.route("/admin").get(authenticate, authorizeAdmin, getTodasLasCitas); // Obtener todas las citas (solo admins)

export default router;
