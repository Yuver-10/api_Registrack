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

export default router;
