// src/routes/permisoRoutes.js
import { Router } from 'express';
import {
  createPermiso,
  getAllPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso
} from '../controllers/permisoController.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Todas las rutas de permisos solo para administradores
router.post('/', roleMiddleware(["administrador"]), createPermiso);
router.get('/', roleMiddleware(["administrador"]), getAllPermisos);
router.get('/:id', roleMiddleware(["administrador"]), getPermisoById);
router.put('/:id', roleMiddleware(["administrador"]), updatePermiso);
router.delete('/:id', roleMiddleware(["administrador"]), deletePermiso);

export default router;
