import express from "express";
import solicitudesRoutes from "./src/routes/solicitudes.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/error.middleware.js";

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas de la API
app.use("/api", solicitudesRoutes);

// Middleware para manejar rutas no encontradas (debe ir antes del error handler)
app.use(notFoundHandler);

// Middleware para manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
