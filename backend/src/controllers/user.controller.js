import User from "../models/User.js"; // 👈 Asegúrate de que el nombre del archivo sea correcto

export const getProfile = async (req, res) => {
    try {
        console.log("🔍 Buscando perfil del usuario con ID:", req.user?._id);

        // Asegurar que req.user existe y contiene el ID del usuario autenticado
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "No estás autenticado" });
        }

        // Buscar el usuario con el ID del token
        const user = await User.findById(req.user._id).select("-password");
        
        if (!user) {
            console.log("❌ Usuario no encontrado en la BD");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("✅ Usuario encontrado:", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("❌ Error al obtener el perfil:", error);
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};

export const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        // 🔹 Asegurar que el rol sea "admin"
        const newAdmin = new User({ name, email, password, role: "admin" });
        await newAdmin.save();

        res.status(201).json({ message: "Administrador creado exitosamente", user: newAdmin });
    } catch (error) {
        console.error("❌ Error al crear administrador:", error);
        res.status(500).json({ message: "Error al crear administrador", error });
    }
};
