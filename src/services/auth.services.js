import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/auth.repository.js";

// 🔹 Lógica de registro
export const registerUser = async (datos) => {
  const hashedPassword = await bcrypt.hash(datos.contrasena, 10);
  return await createUser({ ...datos, contrasena: hashedPassword });
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
