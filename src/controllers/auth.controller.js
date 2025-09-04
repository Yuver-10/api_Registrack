import {
  registerUser,
  loginUser,
  handleForgotPassword,
  handleResetPassword,
} from "../services/auth.services.js";

export const register = async (req, res) => {
  try {
    const nuevoUsuario = await registerUser(req.body);
    res
      .status(201)
      .json({
        mensaje: "Usuario registrado correctamente",
        usuario: nuevoUsuario,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const { usuario, token } = await loginUser(correo, contrasena);
    res.json({ mensaje: "Login exitoso", token, usuario });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para solicitar restablecimiento de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    await handleForgotPassword(correo);
    // Respuesta neutra para no revelar si el correo existe
    res
      .status(200)
      .json({
        mensaje:
          "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      });
  } catch (error) {
    // No enviar el error al cliente para mantener la respuesta neutra
    console.error("Error en el controlador forgotPassword:", error);
    res
      .status(200)
      .json({
        mensaje:
          "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      });
  }
};

// Controlador para restablecer la contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ mensaje: "Token y nueva contraseña son requeridos." });
    }
    await handleResetPassword(token, newPassword);
    res
      .status(200)
      .json({ mensaje: "Tu contraseña ha sido restablecida exitosamente." });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};
