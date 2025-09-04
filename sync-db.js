import sequelize from "./src/config/db.js";
import "./src/models/orden_servico_Servicio.js";
import "./src/models/citas.js";
import "./src/models/user.js";
import "./src/models/solicitud_cita.js";
import "./src/models/Empleado.js";
import "./src/models/Servicio.js";
import "./src/models/Seguimiento.js";
import "./src/models/Cliente.js";
import "./src/models/Empresa.js";
import "./src/models/EmpresaCliente.js";
import "./src/models/OrdenServicio.js";
import "./src/models/Servicio.js";

async function syncDatabase() {
  try {
    console.log("Sincronizando modelos con la base de datos...");
    
    // Sincronizar todos los modelos
    await sequelize.sync({ alter: true });
    
    console.log("Base de datos sincronizada correctamente");
    console.log("Tablas creadas/actualizadas:");
    console.log("   - ordenes_de_servicios");
    console.log("   - servicios");
    console.log("   - citas");
    console.log("   - usuarios");
    console.log("   - solicitudes_citas");
    console.log("   - empleados");
    console.log("   - Servicios");
    console.log("   - Seguimiento");
    console.log("   - Clientes");
    console.log("   - Empresas");
    console.log("   - EmpresaClientes (tabla intermedia)");
    console.log("   - OrdenServicios");
    console.log("   - Servicios");
    console.log("   - Y cualquier otra tabla definida en los modelos");
    
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
