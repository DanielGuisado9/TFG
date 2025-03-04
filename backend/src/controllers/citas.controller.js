import Cita from "../models/cita.js";

// Obtener todas las citas (Solo Admins pueden ver todas)
export const getCitas = async (req, res) => {
    try {
        let citas;
        if (req.role === "admin") {
            citas = await Cita.find().populate("userId").populate("serviceId");
        } else {
            citas = await Cita.find({ userId: req.userId }).populate("serviceId");
        }

        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las citas", error });
    }
};

// Crear una nueva cita (Cualquier usuario autenticado)

export const createCita = async (req, res) => {
    try {
        const { date, time, serviceId } = req.body;

        console.log("Datos recibidos en la solicitud:", { date, time, serviceId }); // 👀 Verifica qué se está recibiendo

        if (!serviceId) {
            return res.status(400).json({ message: "El campo serviceId es obligatorio" });
        }

        const nuevaCita = new Cita({ userId: req.userId, date, time, serviceId });
        await nuevaCita.save();

        res.status(201).json({ message: "Cita creada exitosamente", cita: nuevaCita });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).json({ message: "Error al crear la cita", error });
    }
};



