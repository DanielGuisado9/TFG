import "dotenv/config";
import express from "express";
import connectDB from "./src/loaders/database.loader.js";
import loadExpress from "./src/loaders/express.loader.js";
import loadRoutes from "./src/loaders/routes.loader.js";
import logger from "./src/utils/logger.js"; 
import morganMiddleware from "./src/middleware/morgan.middleware.js"; // 📌 Importamos Morgan

const app = express();

// 📌 Registrar cuando el servidor arranca
logger.info("🚀 Iniciando servidor...");

// Usar Morgan para registrar las solicitudes HTTP
app.use(morganMiddleware);

// Cargar Loaders
await connectDB();
loadExpress(app);
loadRoutes(app);

app.use((err, req, res, next) => {
    logger.error(`❌ Error en ${req.method} ${req.url}: ${err.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`));
