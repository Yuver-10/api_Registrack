import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transporte de correo para Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo de Gmail
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación de Gmail
  },
});

/**
 * Envía un correo electrónico para restablecer la contraseña.
 * @param {string} to - El correo del destinatario.
 * @param {string} token - El token de restablecimiento.
 * @param {string} userName - El nombre del usuario.
 */
export const sendPasswordResetEmail = async (to, token, userName) => {
  const resetUrl = `https://mi-frontend.com/reset-password?token=${token}`;

const mailOptions = {
  from: `"Soporte Registrack" <${process.env.EMAIL_USER}>`,
  to,
  subject: "Restablecimiento de tu contraseña en Registrack",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 0; margin: 0;">
    <!-- Navbar -->
    <div style="background-color: #007bff; padding: 15px; text-align: center; color: white; font-size: 20px; font-weight: bold; border-radius: 5px 5px 0 0;">
      🔐 Registrack - Recuperación de contraseña
    </div>

    <!-- Contenido principal -->
    <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #333;">Hola ${userName},</h2>
      <p style="color: #555; font-size: 15px;">
        Recibimos una solicitud para restablecer tu contraseña en 
        <strong style="color: #007bff;">Registrack</strong>.
      </p>
      <p style="color: #555; font-size: 15px;">
        Haz clic en el siguiente botón para continuar con el proceso. 
        Este enlace es válido por <strong>15 minutos</strong>.
      </p>

      <!-- Botón -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" 
           style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
          Restablecer Contraseña
        </a>
      </div>

      <p style="color: #555; font-size: 14px;">
        Si el botón no funciona, copia y pega la siguiente URL en tu navegador:
      </p>
      <p style="word-break: break-all;">
        <a href="${resetUrl}" style="color: #007bff; font-size: 14px;">${resetUrl}</a>
      </p>

      <p style="font-size: 14px; color: #333; margin-top: 20px;">
        Si estás probando con Postman, puedes usar el siguiente token directamente:
      </p>
      <p style="background-color: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 15px; color: #212529; text-align: center; word-break: break-all;">
        ${token}
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #777; font-size: 13px; text-align: center;">
        Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
      </p>
      <p style="color: #777; font-size: 13px; text-align: center; margin-top: 10px;">
        ¡Gracias por confiar en nosotros! <br>
        <em>El equipo de Registrack</em>
      </p>
    </div>
  </div>
  `,
};


  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de restablecimiento enviado a: ${to}`);
  } catch (error) {
    console.error(`Error al enviar el correo a ${to}:`, error);
    // En un entorno de producción, sería bueno tener un sistema de logging más robusto aquí.
    throw new Error('No se pudo enviar el correo de restablecimiento.');
  }
};
