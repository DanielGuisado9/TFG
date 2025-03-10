import Cita from "../models/cita.js";
import Service from "../models/service.js";
import mongoose from "mongoose";

// Obtener todas las citas de un usuario autenticado
export const getCitas = async (req, res) => {
    try {
        console.log("🔍 Buscando citas para el usuario:", req.userId);
        const citas = await Cita.find({ userId: req.userId }).populate("serviceId");
        if (!citas || citas.length === 0) {
            return res.status(404).json({ message: "No tienes citas registradas" });
        }
        res.status(200).json(citas);
    } catch (error) {
        console.error("❌ Error al obtener las citas:", error);
        res.status(500).json({ message: "Error al obtener las citas", error });
    }
};

// Crear una nueva cita
export const createCita = async (req, res) => {
    try {
        const { date, time, serviceId } = req.body;

        console.log("📌 Creando cita con datos:", { date, time, serviceId });

        if (!date || !time || !serviceId) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: "ID de servicio no válido" });
        }

        const serviceExists = await Service.findById(serviceId);
        if (!serviceExists) {
            return res.status(404).json({ message: "El servicio seleccionado no existe" });
        }

        const nuevaCita = new Cita({ userId: req.userId, date, time, serviceId });
        await nuevaCita.save();

        res.status(201).json({ message: "Cita creada exitosamente", cita: nuevaCita });
    } catch (error) {
        console.error("❌ Error al crear la cita:", error);
        res.status(500).json({ message: "Error al crear la cita", error });
    }
};

// Cancelar una cita
export const cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("🗑️ Intentando cancelar cita con ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de cita no válido" });
        }

        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        if (cita.userId.toString() !== req.userId && req.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta cita" });
        }

        await Cita.findByIdAndDelete(id);
        res.status(200).json({ message: "Cita cancelada exitosamente" });
    } catch (error) {
        console.error("❌ Error al cancelar la cita:", error);
        res.status(500).json({ message: "Error al cancelar la cita", error });
    }
};

// Obtener todas las citas (solo para administradores)
export const getTodasLasCitas = async (req, res) => {
    try {
        console.log("🔍 Consultando todas las citas - usuario rol:", req.role);
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado, solo administradores pueden ver todas las citas" });
        }

        const citas = await Cita.find().populate("userId").populate("serviceId");
        if (!citas || citas.length === 0) {
            return res.status(404).json({ message: "No hay citas registradas" });
        }
        res.status(200).json(citas);
    } catch (error) {
        console.error("❌ Error al obtener todas las citas:", error);
        res.status(500).json({ message: "Error al obtener todas las citas", error });
    }
};

// Obtener una cita por ID
export const getCitaById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 Buscando cita con ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de cita no válido" });
        }

        const cita = await Cita.findById(id).populate("serviceId");
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        if (cita.userId.toString() !== req.userId && req.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para ver esta cita" });
        }

        res.status(200).json(cita);
    } catch (error) {
        console.error("❌ Error al obtener la cita:", error);
        res.status(500).json({ message: "Error al obtener la cita", error });
    }
};
