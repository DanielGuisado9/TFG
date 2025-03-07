import express from "express";
import { someAdminFunction } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";

const router = express.Router();

// 📌 RESTful: Obtener información del panel de administración (GET /api/admin/dashboard)
router.route("/dashboard").get(authenticate, authorizeRole("admin"), someAdminFunction);

export default router;
