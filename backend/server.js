import "dotenv/config";
import express from "express";
import connectDB from "./src/loaders/database.loader.js";
import loadExpress from "./src/loaders/express.loader.js";
import loadRoutes from "./src/loaders/routes.loader.js";

const app = express();

// Cargar Loaders
await connectDB();
loadExpress(app);
loadRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
