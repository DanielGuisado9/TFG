import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import citasRoutes from "../routes/citas.routes.js";
import serviceRoutes from "../routes/service.routes.js";

export default (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/citas", citasRoutes);
    app.use("/api/services", serviceRoutes);
    
    console.log("📌 Todas las rutas han sido cargadas correctamente");
};
