import express from "express";
import { getServices, createService, updateService, deleteService } from "../controllers/services.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// Obtener todos los servicios (accesible para todos)
router.get("/", getServices);

// Crear un nuevo servicio (solo admins)
router.post("/", authenticate, authorizeAdmin, createService);

// Actualizar un servicio (solo admins)
router.put("/:id", authenticate, authorizeAdmin, updateService);

// Eliminar un servicio (solo admins)
router.delete("/:id", authenticate, authorizeAdmin, deleteService);

export default router;
