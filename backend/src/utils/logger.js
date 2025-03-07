import winston from "winston";

// Formato personalizado para los logs
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Configuración del logger con niveles de log y transportes (consola y archivo)
const logger = winston.createLogger({
    level: "info", // Niveles: error, warn, info, http, verbose, debug, silly
    format: logFormat,
    transports: [
        new winston.transports.Console(), // Muestra logs en la consola
        new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Guarda errores en logs/error.log
        new winston.transports.File({ filename: "logs/combined.log" }) // Guarda todos los logs
    ]
});

export default logger;
