import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};


// // Middleware para verificar rol
// export const checkRole = (rolesPermitidos) => {
//   return (req, res, next) => {
//     if (!rolesPermitidos.includes(req.usuario.rol)) {
//       return res.status(403).json({ mensaje: 'No tienes permisos' });
//     }
//     next();
//   };
