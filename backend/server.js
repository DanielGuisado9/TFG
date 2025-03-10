import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/config/database.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import citasRoutes from './src/routes/citas.routes.js';
import servicesRoutes from './src/routes/services.routes.js';

// Asegurar que la base de datos se conecte antes de iniciar el servidor
try {
    await connectDB();
    console.log("✅ Conectado a la base de datos");
} catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    process.exit(1);
}

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/services', servicesRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

export { app, server }; // 🔥 Exportamos `server` para cerrarlo en los tests
