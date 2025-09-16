import { body, param, validationResult } from "express-validator";

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: "Validación fallida", errores: errors.array().map(e => e.msg) });
  }
  next();
};

export const validateUpload = [
  body("url_archivo").isString().isLength({ min: 5 }).withMessage("url_archivo requerido"),
  body("id_tipo_archivo").isInt({ min: 1 }).withMessage("id_tipo_archivo debe ser entero positivo"),
  body("id_cliente").isInt({ min: 1 }).withMessage("id_cliente debe ser entero positivo"),
  body("id_orden_servicio").optional({ nullable: true }).isInt({ min: 1 }).withMessage("id_orden_servicio inválido"),
  handle,
];

export const validateArchivoId = [
  param("id").isInt({ min: 1 }).withMessage("id inválido"),
  handle,
];

export const validateClienteId = [
  param("idCliente").isInt({ min: 1 }).withMessage("idCliente inválido"),
  handle,
];


