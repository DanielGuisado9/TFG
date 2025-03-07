import { Router } from "express";
import { createService, getServices} from "../controllers/services.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getServices); // 🔹 Cualquier usuario puede ver los servicios
router.post("/", authenticate, authorizeAdmin, createService); // 🔹 Solo admin o Super Admin pueden crear

export default router;
