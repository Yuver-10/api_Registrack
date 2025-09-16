import { body, param, validationResult } from "express-validator";

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: "Validación fallida", errores: errors.array().map(e => e.msg) });
  }
  next();
};

export const validateCreateTipo = [
  body("descripcion").trim().isLength({ min: 2, max: 50 }).withMessage("descripcion 2-50 caracteres"),
  handle,
];

export const validateUpdateTipo = [
  param("id").isInt({ min: 1 }).withMessage("id inválido"),
  body("descripcion").optional().trim().isLength({ min: 2, max: 50 }).withMessage("descripcion 2-50 caracteres"),
  handle,
];

export const validateIdTipo = [
  param("id").isInt({ min: 1 }).withMessage("id inválido"),
  handle,
];


