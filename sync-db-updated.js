import sequelize from "./src/config/db.js";
import {
  Role,
  Permiso,
  Privilegio,
  RolPermisoPrivilegio,
  Seguimiento,
  Servicio,
  Proceso,
  OrdenServicio,
} from "./src/models/index.js";

async function syncDatabase() {
  try {
    console.log("🔄 Iniciando sincronización de la base de datos...");

    // Sincronizar todos los modelos
    await sequelize.sync({ force: true });
    console.log("✅ Base de datos sincronizada exitosamente");

    console.log("📋 Modelos sincronizados:");
    console.log("  - Roles");
    console.log("  - Permisos");
    console.log("  - Privilegios");
    console.log("  - Servicios");
    console.log("  - Procesos");
    console.log("  - Ordenes de Servicio");
    console.log("  - Seguimientos");

    console.log("🎉 Proceso de sincronización completado");
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
