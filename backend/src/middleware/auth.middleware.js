import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // 👈 ¡Asegúrate de que sea el modelo correcto!

dotenv.config();

// 🔹 Middleware para autenticar al usuario
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            console.log("❌ No se proporcionó token");
            return res.status(401).json({ message: "Acceso denegado, no se proporcionó token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decodificado:", decoded);

        const user = await User.findById(decoded.userId).select("name email role"); 

        if (!user) {
            console.log("❌ Usuario no encontrado en la BD");
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.user = user; // 👈 Guardamos el usuario en `req.user` para usarlo en otros middlewares
        console.log("✅ Usuario autenticado:", req.user);
        next();
    } catch (error) {
        console.error("❌ Error en authenticate:", error.message);
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
