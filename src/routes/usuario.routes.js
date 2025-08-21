import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { getUsuarios, getUsuarioPorId, updateUsuario, deleteUsuario, createUserByAdmin } from '../controllers/user.controller.js';
import { validarNuevoUsuario, validarActualizarUsuario } from '../middlewares/validarUsuario.js';
import { validarCrearUsuarioPorAdmin } from '../middlewares/validarUsuarioAdmin.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/register', validarNuevoUsuario, register);
router.post('/login', login);

// Rutas protegidas - Solo administradores y empleados
router.get('/', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarios);
router.get('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarioPorId);
router.delete('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), deleteUsuario);

// Ruta de actualización - Todos los roles autenticados (con validación en controlador)
router.put('/:id', authMiddleware, validarActualizarUsuario, updateUsuario);

// Ruta para crear usuarios con rol específico - Solo administradores
router.post('/create-user', authMiddleware, roleMiddleware(["administrador"]), validarCrearUsuarioPorAdmin, createUserByAdmin);

export default router;