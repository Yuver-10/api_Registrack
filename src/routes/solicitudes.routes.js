import { Router } from "express";
import {
  listarSolicitudes,
  buscarSolicitud,
  verDetalleSolicitud,
  anularSolicitud,
  crearSolicitud,
  editarSolicitud,
} from "../controllers/solicitudes.controller.js";
import {
  validateSolicitud,
  validateSearch,
  validateId,
  validateEdicionSolicitud,
} from "../middlewares/validation.middleware.js";

// 🔐 Middlewares de seguridad
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// 🔹 Cliente puede crear solicitud
router.post(
  "/crear",
  authMiddleware,
  roleMiddleware(["cliente", "administrador", "empleado"]), // opcionalmente admin/empleado también
  validateSolicitud,
  crearSolicitud
);

// 🔹 Cliente puede ver solo las suyas (este endpoint lo tienes que crear en tu controller)
router.get(
  "/mias",
  authMiddleware,
  roleMiddleware(["cliente"]),
  listarSolicitudes // 👉 aquí deberíamos filtrar por req.user.id en el controller
);

// 🔹 Admin y empleado pueden gestionar todas
router.get("/", authMiddleware, roleMiddleware(["administrador", "empleado"]), listarSolicitudes);
router.get("/buscar", authMiddleware, roleMiddleware(["administrador", "empleado"]), validateSearch, buscarSolicitud);
router.get("/:id", authMiddleware, roleMiddleware(["administrador", "empleado"]), validateId, verDetalleSolicitud);
router.put("/anular/:id", authMiddleware, roleMiddleware(["administrador", "empleado"]), validateId, anularSolicitud);
router.put("/editar/:id", authMiddleware, roleMiddleware(["administrador", "empleado"]), validateId, validateEdicionSolicitud, editarSolicitud);

export default router;
