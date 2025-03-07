import { Router } from "express";
import { createService, getServices, deleteService, getFilteredServices} from "../controllers/services.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";


const router = Router();

router.get("/", getServices); // 🔹 Cualquier usuario puede ver los servicios
router.post("/", authenticate, authorizeAdmin, createService); // 🔹 Solo admin o Super Admin pueden crear
router.delete("/:id", authenticate, authorizeAdmin, deleteService);// 🔹 Solo admin o Super Admin pueden eliminar
router.get("/", getFilteredServices); // Obtener servicios con filtros y paginación


export default router;
