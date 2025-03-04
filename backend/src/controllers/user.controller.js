import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};

export const createAdmin = async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo administradores pueden crear otros administradores" });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        const newAdmin = new User({ name, email, password, role: "admin" });
        await newAdmin.save();

        res.status(201).json({ message: "Administrador creado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear administrador", error });
    }
};
