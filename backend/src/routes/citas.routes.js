import express from "express";
import { createCita, getCitas } from "../controllers/citas.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", authenticate, createCita);
router.get("/", authenticate, getCitas);

export default router;
