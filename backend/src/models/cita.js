import mongoose from "mongoose";

const CitaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Cita", CitaSchema);
