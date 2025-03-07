import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 5 } // Duración mínima en minutos
}, { timestamps: true });

export default mongoose.model("Service", ServiceSchema);
