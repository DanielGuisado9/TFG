import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";

// Registro de usuario
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        const newUser = new User({ name, email, password, role: "usuario" }); // Siempre usuario
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Usuario registrado exitosamente", token });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Correo o contraseña incorrectos" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Correo o contraseña incorrectos" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
};

// Generar token para recuperación de contraseña
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

// Resetear contraseña
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Token inválido o expirado" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restablecer la contraseña", error });
    }
};
