import { Router } from "express";
import {
  listarSolicitudes,
  listarSolicitudesEnProceso,
  listarSolicitudesFinalizadas,
  listarMisSolicitudesEnProceso,
  listarMiHistorial,
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

//  Middlewares de seguridad
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// Ruta para crear solicitud con validación dinámica según el servicio en la URL
router.post(
  "/crear/:servicio",
  authMiddleware,
  roleMiddleware(["cliente", "administrador", "empleado"]),
  crearSolicitud
);

//  Cliente puede ver solo las suyas (endpoint general)
router.get(
  "/mias",
  authMiddleware,
  roleMiddleware(["cliente"]),
  listarSolicitudes
);

//  Nuevos endpoints para clientes - separar en proceso y finalizadas
router.get(
  "/mias/proceso",
  authMiddleware,
  roleMiddleware(["cliente"]),
  listarMisSolicitudesEnProceso
);

router.get(
  "/mias/historial",
  authMiddleware,
  roleMiddleware(["cliente"]),
  listarMiHistorial
);

//  Admin y empleado pueden gestionar todas
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  listarSolicitudes
);

//  Nuevos endpoints para separar solicitudes en proceso y finalizadas
router.get(
  "/proceso",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  listarSolicitudesEnProceso
);
router.get(
  "/fin",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  listarSolicitudesFinalizadas
);
router.get(
  "/buscar",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  validateSearch,
  buscarSolicitud
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  validateId,
  verDetalleSolicitud
);
router.put(
  "/anular/:id",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  validateId,
  anularSolicitud
);
router.put(
  "/editar/:id",
  authMiddleware,
  roleMiddleware(["administrador", "empleado"]),
  validateId,
  validateEdicionSolicitud,
  editarSolicitud
);

export default router;
