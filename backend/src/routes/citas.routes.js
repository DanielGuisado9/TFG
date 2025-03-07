import express from "express";
import { createCita, getCitas, getTodasLasCitas } from "../controllers/citas.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";
import { cancelarCita } from "../controllers/citas.controller.js";



const router = express.Router();

router.post("/", authenticate, createCita);
router.get("/", authenticate, getCitas);
router.delete("/:id", authenticate, cancelarCita);
router.get("/admin", authenticate, authorizeAdmin, getTodasLasCitas);



export default router;
