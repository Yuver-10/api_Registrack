import express from "express";
import cors from "cors";

import pagoRoutes from "./src/routes/pago.routes.js";
import UsuarioRoutes from "./src/routes/usuario.routes.js";
import EmpleadoRoutes from "./src/routes/empleado.routes.js";
import RolesRoutes from './src/routes/role.routes.js';
import PermisoRoutes from './src/routes/permiso.routes.js';
import PrivilegioRoutes from './src/routes/privilegio.routes.js';
import CitasRoutes from "./src/routes/citas.routes.js";
import ServicioRoutes from "./src/routes/servicio.routes.js";
import SeguimientoRoutes from "./src/routes/seguimiento.routes.js";
import SolicitudesRoutes from "./src/routes/solicitudes.routes.js";
import SolicitudCitaRoutes from "./src/routes/solicitud_cita.routes.js";
import ClienteRoutes from "./src/routes/cliente.routes.js";
import EmpresaRoutes from "./src/routes/empresa.routes.js";


import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/error.middleware.js";

import "./src/config/db.js"; 

//  Importaremos los middlewares de seguridad
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import { roleMiddleware } from "./src/middlewares/role.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Usuarios: aquí suele estar el login/registro (NO necesita auth globalmente)
app.use("/api/usuarios", UsuarioRoutes);

// Servicios: rutas públicas para consultar servicios
app.use("/api/servicios", ServicioRoutes);

// Rutas protegidas
app.use("/api/empleados", authMiddleware, EmpleadoRoutes);
app.use("/api/pagos", authMiddleware, pagoRoutes);
app.use("/api/roles", authMiddleware, RolesRoutes);
app.use("/api/permisos", authMiddleware, PermisoRoutes);
app.use("/api/privilegios", authMiddleware, PrivilegioRoutes);
app.use("/api/citas", authMiddleware, CitasRoutes);
app.use("/api/solicitudes", authMiddleware, SolicitudesRoutes);
app.use("/api/solicitud-cita", authMiddleware, SolicitudCitaRoutes);
app.use("/api/seguimiento", authMiddleware, SeguimientoRoutes);
app.use("/api/clientes", authMiddleware, ClienteRoutes);
app.use("/api/empresas", authMiddleware, EmpresaRoutes);


// Middleware para manejar rutas no encontradas (debe ir antes del error handler)
app.use(notFoundHandler);

// Middleware para manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
