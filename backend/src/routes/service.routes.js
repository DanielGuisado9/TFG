import express from "express";
import { getServices, createService, updateService, deleteService } from "../controllers/service.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", authenticate, authorizeAdmin, createService);
router.put("/:id", authenticate, authorizeAdmin, updateService);
router.delete("/:id", authenticate, authorizeAdmin, deleteService);

export default router;
