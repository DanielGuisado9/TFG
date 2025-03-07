import Service from "../models/service.js";
import mongoose from "mongoose"; // Para validar IDs
import logger from "../utils/logger.js";

export const createService = async (req, res) => {
    try {
        console.log("👤 Usuario intentando crear servicio:", req.user); // 🔍 Debug en consola

        const { name, price, duration } = req.body;

        if (!name || !price || !duration) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newService = new Service({ name, price, duration });
        await newService.save();

        res.status(201).json({ message: "Servicio creado correctamente", service: newService });
    } catch (error) {
        console.error("❌ Error al crear servicio:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Obtener todos los servicios (disponible para todos)
export const getServices = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1 || limit < 1) {
            logger.warn("⚠️ Petición con valores de paginación inválidos");
            return res.status(400).json({ message: "Los valores de página y límite deben ser mayores a 0" });
        }

        const skip = (page - 1) * limit;

        // Obtener total de documentos
        const total = await Service.countDocuments();
        
        // Obtener servicios con paginación
        const services = await Service.find()
            .skip(skip)
            .limit(limit);

        logger.info(`✅ Servicios obtenidos - Página: ${page}, Límite: ${limit}, Total: ${total}`);

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: services
        });

    } catch (error) {
        logger.error(`❌ Error al obtener servicios: ${error.message}`);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};

export const getFilteredServices = async (req, res) => {
    try {
        let { name, minPrice, maxPrice, minDuration, maxDuration, page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: "i" }; // Búsqueda insensible a mayúsculas
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (minDuration || maxDuration) {
            filter.duration = {};
            if (minDuration) filter.duration.$gte = parseFloat(minDuration);
            if (maxDuration) filter.duration.$lte = parseFloat(maxDuration);
        }

        const total = await Service.countDocuments(filter);
        const services = await Service.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: services
        });

    } catch (error) {
        console.error("Error al filtrar servicios:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};


// Eliminar un servicio (solo admins)
export const deleteService = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado, token inválido" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado, solo administradores pueden eliminar servicios" });
        }

        const { id } = req.params;
        console.log("🗑️ Intentando eliminar servicio con ID:", id);

        // Validar si el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de servicio no válido" });
        }

        // Buscar el servicio antes de eliminarlo
        const service = await Service.findById(id);
        if (!service) {
            console.log("❌ Servicio no encontrado en la BD.");
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        // Eliminar el servicio
        await Service.findByIdAndDelete(id);

        console.log("✅ Servicio eliminado correctamente:", id);
        res.status(200).json({ message: "Servicio eliminado exitosamente" });

    } catch (error) {
        console.error("❌ Error en deleteService:", error.message);
        res.status(500).json({ message: "Error al eliminar el servicio", error: error.message });
    }
};