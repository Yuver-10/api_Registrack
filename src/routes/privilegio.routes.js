<<<<<<< HEAD
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
=======
import express from 'express';
import * as privilegioController from '../controllers/privilegio.controller.js';
import {
  createPrivilegioValidation,
  updatePrivilegioValidation,
  idParamValidation,
} from '../middlewares/privilegio.middleware.js';

const router = express.Router();

// Crear privilegio (valida que no exista y que el nombre sea válido)
router.post('/', createPrivilegioValidation, privilegioController.createPrivilegio);

// Obtener todos
router.get('/', privilegioController.getAllPrivilegios);

// Obtener por id (valida que el id sea entero válido)
router.get('/:id', idParamValidation, privilegioController.getPrivilegioById);

// Actualizar (valida id y que el nombre no esté duplicado)
router.put('/:id', updatePrivilegioValidation, privilegioController.updatePrivilegio);

// Eliminar (valida id)
router.delete('/:id', idParamValidation, privilegioController.deletePrivilegio);
>>>>>>> main

export default router;
