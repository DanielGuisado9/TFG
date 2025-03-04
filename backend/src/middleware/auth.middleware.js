import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.header("Authorization");

    console.log("Token recibido:", token); // 👀 Verifica qué token está llegando

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado, no se proporcionó token" });
    }

    try {
        const tokenClean = token.replace("Bearer ", "").trim();
        console.log("Token limpio:", tokenClean); // 👀 Verifica que se está limpiando correctamente

        const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded); // 👀 Muestra el contenido del token

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error); // 👀 Muestra el error exacto
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};
