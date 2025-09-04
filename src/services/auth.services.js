import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findRoleByName } from "../repositories/auth.repository.js";
import { Role as Rol } from "../models/index.js";

// 🔹 Lógica de registro
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

// 🔹 Lógica para crear usuario con rol específico (solo administradores)
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
