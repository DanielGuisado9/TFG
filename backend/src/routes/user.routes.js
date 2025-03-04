import express from "express";
import { getProfile, createAdmin } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.post("/admin", authenticate, authorizeAdmin, createAdmin);

export default router;
