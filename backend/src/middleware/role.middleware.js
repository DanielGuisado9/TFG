export const authorizeAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo administradores pueden acceder" });
    }
    next();
};
