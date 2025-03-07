import express from "express";
import { createService, getServices, deleteService, getFilteredServices } from "../controllers/services.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// 📌 RESTful: Obtener todos los servicios con filtros y paginación
router.route("/").get(getFilteredServices); 

// 📌 RESTful: Crear un servicio (solo admin o super admin)
router.route("/").post(authenticate, authorizeAdmin, createService);

// 📌 RESTful: Eliminar un servicio (solo admin o super admin)
router.route("/:id").delete(authenticate, authorizeAdmin, deleteService);

export default router;
