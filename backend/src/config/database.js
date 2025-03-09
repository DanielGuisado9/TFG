import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conexión a MongoDB establecida correctamente");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        process.exit(1); // Salir con error
    }
};

export default connectDB;
