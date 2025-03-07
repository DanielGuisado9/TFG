import morgan from "morgan";
import logger from "../utils/logger.js";

// Formato de logs personalizado para Winston
const stream = {
    write: (message) => logger.http(message.trim()),
};

// Opciones de Morgan
const morganMiddleware = morgan(
    ":method :url :status - :response-time ms",
    { stream }
);

export default morganMiddleware;
