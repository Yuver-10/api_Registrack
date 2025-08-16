// src/routes/permisoRoutes.js
import { Router } from 'express';
import {
  createPermiso,
  getAllPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso
} from '../controllers/permiso.controller.js';

const router = Router();

// Crear permiso
router.post('/', createPermiso);

// Listar todos los permisos
router.get('/', getAllPermisos);

// Obtener permiso por ID
router.get('/:id', getPermisoById);

// Actualizar permiso por ID
router.put('/:id', updatePermiso);

// Eliminar permiso por ID
router.delete('/:id', deletePermiso);

export default router;
