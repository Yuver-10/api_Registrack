import sequelize from "./src/config/db.js";
import "./src/models/OrdenServicio.js";
import "./src/models/Servicio.js";

async function syncDatabase() {
  try {
    console.log("🔄 Sincronizando modelos con la base de datos...");

    // Sincronizar todos los modelos
    await sequelize.sync({ alter: true });

    console.log("✅ Base de datos sincronizada correctamente");
    console.log("📋 Tablas creadas/actualizadas:");
    console.log("   - ordenes_de_servicios");
    console.log("   - servicios");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
