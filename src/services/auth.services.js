import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import { createUser, findUserByEmail, findRoleByName } from "../repositories/auth.repository.js";
import { Role as Rol } from "../models/index.js";

// 🔹 Lógica de registro
=======
import crypto from "crypto";
import { createUser, findUserByEmail, findRoleByName, findUserByResetToken } from "../repositories/auth.repository.js";
import { Rol } from "../models/user_rol.js";
import { sendPasswordResetEmail } from "./email.service.js";

//  Lógica de registro
>>>>>>> main
export const registerUser = async (datos) => {
  // Buscar el rol 'cliente' automáticamente
  const rolCliente = await findRoleByName('cliente');
  if (!rolCliente) {
    throw new Error('El rol cliente no existe en el sistema. Contacte al administrador.');
  }

  const hashedPassword = await bcrypt.hash(datos.contrasena, 10);
  
  // Asignar automáticamente el rol de cliente
  const datosConRol = {
    ...datos,
    contrasena: hashedPassword,
    id_rol: rolCliente.id_rol
  };
  
  return await createUser(datosConRol);
};

// 🔹 Lógica de login
export const loginUser = async (correo, contrasena) => {
  // buscar el usuario incluyendo su rol
  const usuario = await findUserByEmail(correo);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordValida) {
    throw new Error("Contraseña incorrecta");
  }

  // asegurarse que el rol está disponible
  const rolUsuario = usuario.rol ? usuario.rol.nombre : null; // 🔹 aquí usamos el alias "rol"

  // generar token JWT
  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: rolUsuario
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // devolver datos limpios (sin la contraseña)
  const { contrasena: _, ...usuarioSinPass } = usuario.toJSON();

  return { usuario: usuarioSinPass, token };
};

<<<<<<< HEAD
// 🔹 Lógica para crear usuario con rol específico (solo administradores)
=======
//  Lógica para solicitar restablecimiento de contraseña
export const handleForgotPassword = async (correo) => {
  const usuario = await findUserByEmail(correo);

  // Respuesta neutra para no revelar si un correo existe o no.
  if (!usuario) {
    console.log(`Solicitud de restablecimiento para correo no existente: ${correo}`);
    return;
  }

  // Generar token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Establecer fecha de expiración (15 minutos)
  const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

  // Guardar token hasheado y expiración en el usuario
  usuario.resetPasswordToken = hashedToken;
  usuario.resetPasswordExpires = expirationDate;
  await usuario.save();

  // Enviar correo (con el token original, no el hasheado)
  try {
    await sendPasswordResetEmail(usuario.correo, resetToken, usuario.nombre);
  } catch (error) {
    // Si el correo falla, es importante no exponer el error al cliente.
    // Se loggea internamente y se continúa para dar la respuesta neutra.
    console.error("Error al enviar correo en handleForgotPassword:", error);
  }
};

//  Lógica para restablecer la contraseña
export const handleResetPassword = async (token, newPassword) => {
  // Hashear el token recibido para buscarlo en la BD
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Buscar usuario por el token hasheado
  const usuario = await findUserByResetToken(hashedToken);

  // Validar que el token sea válido y no haya expirado
  if (!usuario || usuario.resetPasswordExpires < new Date()) {
    throw new Error("Token inválido o expirado. Por favor, solicita un nuevo restablecimiento.");
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar contraseña y limpiar campos del token
  usuario.contrasena = hashedPassword;
  usuario.resetPasswordToken = null;
  usuario.resetPasswordExpires = null;
  await usuario.save();
};


//  Lógica para crear usuario con rol específico (solo administradores)
>>>>>>> main
export const createUserWithRole = async (datos) => {
  const { id_rol, ...userData } = datos;
  
  // Validar que se proporcione un rol
  if (!id_rol) {
    throw new Error("El campo id_rol es requerido para crear usuarios por administrador");
  }
  
  // Verificar que el rol existe
  const rolExistente = await Rol.findByPk(id_rol);
  if (!rolExistente) {
    throw new Error("El rol especificado no existe");
  }
  
  // Validar que el rol sea válido (solo admin, empleado, cliente)
  const rolesValidos = ['administrador', 'empleado', 'cliente'];
  if (!rolesValidos.includes(rolExistente.nombre)) {
    throw new Error("Rol no válido. Solo se pueden crear usuarios con roles: administrador, empleado, cliente");
  }
  
  // Verificar duplicados por correo
  const usuarioExistente = await findUserByEmail(userData.correo);
  if (usuarioExistente) {
    throw new Error("Ya existe un usuario con este correo electrónico");
  }
  
  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
  
  // Crear usuario con rol específico
  const nuevoUsuario = await createUser({ 
    ...userData, 
    contrasena: hashedPassword,
    id_rol: id_rol 
  });
  
  // Buscar usuario creado con información del rol
  const usuarioConRol = await findUserByEmail(userData.correo);
  
  // Devolver datos limpios (sin la contraseña)
  const { contrasena: _, ...usuarioSinPass } = usuarioConRol.toJSON();
  
  return usuarioSinPass;
};
