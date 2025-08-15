// Middleware para manejo centralizado de errores
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Error de validación de JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      mensaje: "JSON inválido en el body de la petición",
      error: "Formato de JSON incorrecto",
    });
  }

  // Error de validación de datos
  if (err.name === "ValidationError") {
    return res.status(400).json({
      mensaje: "Error de validación",
      error: err.message,
    });
  }

  // Error de base de datos
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      mensaje: "Error en los datos enviados",
      error: err.message,
    });
  }

  // Error de conexión a base de datos
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      mensaje: "Error de conexión a la base de datos",
      error: "Servicio temporalmente no disponible",
    });
  }

  // Error genérico
  res.status(500).json({
    mensaje: "Error interno del servidor",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Algo salió mal",
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
  });
};
