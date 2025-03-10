import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ Conectado a MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error conectando a la base de datos: ${error.message}`);
        process.exit(1); // Salir con error
    }
}
