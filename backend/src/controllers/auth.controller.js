import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Middleware de autenticación
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Acceso denegado, no se proporcionó token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};

// ✅ Creación de usuario
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear usuario", error });
    }
};

// ✅ Registro de usuario (incluye SUPER ADMIN)
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        console.log("Registrando usuario con email:", email);
        console.log("SUPER_ADMIN_EMAIL desde .env:", process.env.SUPER_ADMIN_EMAIL);

        let assignedRole = "usuario"; // 🔹 Por defecto, todos son usuarios

        // 🔥 FORZAR que el Super Admin se registre como "admin"
        if (email.trim().toLowerCase() === process.env.SUPER_ADMIN_EMAIL.trim().toLowerCase()) {
            console.log("✔️ Este usuario es el Super Admin, asignando rol de admin");
            assignedRole = "admin";
        }

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role: assignedRole });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "Usuario registrado exitosamente", token, user: newUser });
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

// ✅ Creación de admin por el Super Admin
export const createAdmin = async (req, res) => {
    try {
        // Verificar que solo el SUPER ADMIN puede crear otros admins
        if (!req.user || req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "Acceso denegado, solo el Super Admin puede crear administradores" });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newAdmin = new User({ name, email, password: hashedPassword, role: "admin" });
        await newAdmin.save();

        res.status(201).json({ message: "Administrador creado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear administrador", error });
    }
};

// ✅ Inicio de sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Contraseña incorrecta" });

        // **🔹 Crear token incluyendo el role**
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login exitoso", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
};

// ✅ Generar token para recuperación de contraseña
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hora de validez
        await user.save();

        // Enviar email con el token
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail(email, "Recuperación de contraseña", `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetURL}`);

        res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar correo de recuperación", error });
    }
};

// ✅ Resetear contraseña
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Token inválido o expirado" });

        user.password = bcrypt.hashSync(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restablecer la contraseña", error });
    }
};
