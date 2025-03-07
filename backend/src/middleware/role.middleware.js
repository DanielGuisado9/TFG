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