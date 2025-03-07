import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Importa el modelo de usuario
import dotenv from "dotenv";

dotenv.config();

export const authenticate = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado, no se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscamos al usuario en la base de datos para confirmar su rol
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        req.user = user; // Guardamos el usuario autenticado

        console.log("✅ Usuario autenticado correctamente:", req.user); // DEBUG
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

// 🔹 Middleware para verificar si el usuario es ADMIN
export const authorizeAdmin = (req, res, next) => {
    console.log("Middleware authorizeAdmin ejecutado");
    console.log("req.user:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Acceso denegado, usuario no autenticado" });
    }

    if (req.user.role !== "admin") {
        console.log("❌ Acceso denegado: el usuario no es admin");
        return res.status(403).json({ message: "Acceso denegado, solo administradores pueden acceder" });
    }

    console.log("✅ Acceso permitido: usuario es admin");
    next();
};
