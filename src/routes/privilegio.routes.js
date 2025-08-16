// src/routes/privilegioRoutes.js
import { Router } from 'express';
import {
  createPrivilegio,
  getAllPrivilegios,
  getPrivilegioById,
  updatePrivilegio,
  deletePrivilegio
} from '../controllers/privilegio.controller.js';

const router = Router();

// Crear privilegio
router.post('/', createPrivilegio);

// Listar todos los privilegios
router.get('/', getAllPrivilegios);

// Obtener privilegio por ID
router.get('/:id', getPrivilegioById);

// Actualizar privilegio por ID
router.put('/:id', updatePrivilegio);

// Eliminar privilegio por ID
router.delete('/:id', deletePrivilegio);

export default router;
