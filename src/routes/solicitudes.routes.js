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

const router = Router();

// Rutas para solicitudes
router.get("/solicitudes", listarSolicitudes);
router.get("/solicitudes/buscar", validateSearch, buscarSolicitud);
router.get("/solicitudes/:id", validateId, verDetalleSolicitud);
router.put("/solicitudes/anular/:id", validateId, anularSolicitud);
router.post("/solicitudes/crear", validateSolicitud, crearSolicitud);
router.put(
  "/solicitudes/editar/:id",
  validateId,
  validateEdicionSolicitud,
  editarSolicitud
);

export default router;
