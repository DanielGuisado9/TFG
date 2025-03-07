import Service from "../models/service.js";

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
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios", error });
    }
};
// Actualizar un servicio (solo admins)
export const updateService = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado, solo administradores pueden actualizar servicios" });
        }

        const { id } = req.params;
        const { name, price, duration } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, price, duration },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        res.status(200).json({ message: "Servicio actualizado exitosamente", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el servicio", error });
    }
};

// Eliminar un servicio (solo admins)
export const deleteService = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado, solo administradores pueden eliminar servicios" });
        }

        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        res.status(200).json({ message: "Servicio eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el servicio", error });
    }
};
