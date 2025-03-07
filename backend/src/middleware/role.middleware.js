export const authorizeAdmin = (req, res, next) => {
    try {
        console.log("🔍 Usuario autenticado:", req.user); // Ver qué usuario está autenticado
        console.log("🔍 Rol del usuario:", req.user?.role); // Verificar su rol

        if (!req.user || (req.user.role !== "admin" && req.user.email !== process.env.SUPER_ADMIN_EMAIL)) {
            return res.status(403).json({ message: "Acceso denegado, solo administradores pueden acceder" });
        }
        
        next();
    } catch (error) {
        console.error("❌ Error en authorizeAdmin:", error);
        return res.status(500).json({ message: "Error en la autorización" });
    }
};
