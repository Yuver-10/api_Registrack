// src/routes/privilegioRoutes.js
import { Router } from 'express';
import {
  createPrivilegio,
  getAllPrivilegios,
  getPrivilegioById,
  updatePrivilegio,
  deletePrivilegio
} from '../controllers/privilegio.controller.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Todas las rutas de privilegios solo para administradores
router.post('/', roleMiddleware(["administrador"]), createPrivilegio);
router.get('/', roleMiddleware(["administrador"]), getAllPrivilegios);
router.get('/:id', roleMiddleware(["administrador"]), getPrivilegioById);
router.put('/:id', roleMiddleware(["administrador"]), updatePrivilegio);
router.delete('/:id', roleMiddleware(["administrador"]), deletePrivilegio);

export default router;
