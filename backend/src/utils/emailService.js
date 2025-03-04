import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"La Barbiere" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log("📩 Correo enviado a:", to);
    } catch (error) {
        console.error("❌ Error al enviar correo:", error);
    }
};

export default sendEmail;
