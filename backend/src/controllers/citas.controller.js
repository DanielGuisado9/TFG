import Cita from "../models/cita.js";
import Service from "../models/service.js";
import mongoose from "mongoose";


export const getCitas = async (req, res) => {
    try {
        const citas = await Cita.find({ userId: req.userId }).populate("serviceId");
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las citas", error });
    }
};

// Crear una nueva cita (Cualquier usuario autenticado)

export const createCita = async (req, res) => {
    try {
        const { date, time, serviceId } = req.body;

        console.log("Datos recibidos en la solicitud:", { date, time, serviceId });

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
        console.error("Error al crear la cita:", error);
        res.status(500).json({ message: "Error al crear la cita", error });
    }
};

export const cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("ID recibido para eliminar:", id);

        // Verificar si el ID es un ObjectId válido
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
        console.error("Error al cancelar la cita:", error);
        res.status(500).json({ message: "Error al cancelar la cita", error });
    }
};

export const getTodasLasCitas = async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo administradores pueden ver todas las citas" });
    }

    try {
        const citas = await Cita.find().populate("userId").populate("serviceId");
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todas las citas", error });
    }
};



