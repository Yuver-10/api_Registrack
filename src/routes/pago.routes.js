import { Router } from "express";
import { PagoController } from "../controllers/pago.controller.js";

//  Middlewares de seguridad
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

//  Admin y Empleado pueden gestionar pagos
router.get("/", authMiddleware, roleMiddleware(["administrador", "empleado"]), PagoController.getAll);
router.get("/:id", authMiddleware, roleMiddleware(["administrador", "empleado"]), PagoController.getById);
router.post("/", authMiddleware, roleMiddleware(["administrador", "empleado"]), PagoController.create);

export default router;
