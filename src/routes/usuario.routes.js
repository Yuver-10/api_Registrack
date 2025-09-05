import { Router } from 'express';
<<<<<<< HEAD
import { register, login } from '../controllers/auth.controller.js';
import { getUsuarios, getUsuarioPorId, updateUsuario, deleteUsuario, createUserByAdmin } from '../controllers/user.controller.js';
=======
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { getUsuarios, getUsuarioPorId, updateUsuario, deleteUsuario, createUserByAdmin , changeUserStatus } from '../controllers/user.controller.js';
>>>>>>> main
import { validarNuevoUsuario, validarActualizarUsuario } from '../middlewares/validarUsuario.js';
import { validarCrearUsuarioPorAdmin } from '../middlewares/validarUsuarioAdmin.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
<<<<<<< HEAD

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/register', validarNuevoUsuario, register);
router.post('/login', login);

// Rutas protegidas - Solo administradores y empleados
router.get('/', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarios);
router.get('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarioPorId);
router.delete('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), deleteUsuario);
=======
import { validarForgotPassword, validarResetPassword } from '../middlewares/validarAuth.js';

const router = Router();

// Rutas públicas de autenticación
router.post('/registrar', validarNuevoUsuario, register);
router.post('/login', login);

// Rutas para recuperación de contraseña
router.post('/forgot-password', validarForgotPassword, forgotPassword);
router.post('/reset-password', validarResetPassword, resetPassword);


// Rutas protegidas - Solo administradores y empleados
router.get('/', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarios);
router.get('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), getUsuarioPorId);
delete('/:id', authMiddleware, roleMiddleware(["administrador", "empleado"]), deleteUsuario);
>>>>>>> main

// Ruta de actualización - Todos los roles autenticados (con validación en controlador)
router.put('/:id', authMiddleware, validarActualizarUsuario, updateUsuario);

<<<<<<< HEAD
// Ruta para crear usuarios con rol específico - Solo administradores
router.post('/create-user', authMiddleware, roleMiddleware(["administrador"]), validarCrearUsuarioPorAdmin, createUserByAdmin);
=======
//cambiar estado ya eta con controlador y todo solo la ruta
router.put('/cambiar-estado/:id', authMiddleware, roleMiddleware(["administrador"]), changeUserStatus);


// Ruta para crear usuarios con rol específico - Solo administradores
router.post('/crear', authMiddleware, roleMiddleware(["administrador"]), validarCrearUsuarioPorAdmin, createUserByAdmin);
>>>>>>> main

export default router;