import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true } // Duración en minutos
}, { timestamps: true });

export default mongoose.model("Service", ServiceSchema);
