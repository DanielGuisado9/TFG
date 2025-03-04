import Service from "../models/service.js";

// Obtener todos los servicios
export const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios", error });
    }
};

// Crear un nuevo servicio (solo admins)
export const createService = async (req, res) => {
    if (req.role !== "admin") return res.status(403).json({ message: "Acceso denegado, solo administradores pueden crear servicios" });

    try {
        const { name, price, duration } = req.body;
        const newService = new Service({ name, price, duration });
        await newService.save();

        res.status(201).json({ message: "Servicio creado exitosamente", service: newService });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el servicio", error });
    }
};

// Actualizar un servicio (solo admins)
export const updateService = async (req, res) => {
    if (req.role !== "admin") return res.status(403).json({ message: "Acceso denegado, solo administradores pueden actualizar servicios" });

    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;
        
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, price, duration },
            { new: true }
        );

        if (!updatedService) return res.status(404).json({ message: "Servicio no encontrado" });

        res.status(200).json({ message: "Servicio actualizado exitosamente", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el servicio", error });
    }
};

// Eliminar un servicio (solo admins)
export const deleteService = async (req, res) => {
    if (req.role !== "admin") return res.status(403).json({ message: "Acceso denegado, solo administradores pueden eliminar servicios" });

    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) return res.status(404).json({ message: "Servicio no encontrado" });

        res.status(200).json({ message: "Servicio eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el servicio", error });
    }
};
