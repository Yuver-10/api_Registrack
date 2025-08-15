// server.js

import app from "./app.js";
import sequelize from "./src/config/db.js";
import Servicio from "./src/models/Servicio.js"; // Importar para que se ejecuten las definiciones
import OrdenServicio from "./src/models/OrdenServicio.js"; // Importar para que se ejecuten las definiciones

// Función para inicializar la aplicación
const initializeApp = async () => {
  try {
    // Configurar las relaciones entre modelos DESPUÉS de que estén cargados
    Servicio.hasMany(OrdenServicio, { foreignKey: "id_servicio" });
    OrdenServicio.belongsTo(Servicio, { foreignKey: "id_servicio" });

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa");

    // Sincronizar modelos con la base de datos (alter: true para agregar nuevas columnas)
    await sequelize.sync({ alter: true });
    console.log("✅ Tablas de la base de datos sincronizadas correctamente.");

    // Iniciar el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}.`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    process.exit(1);
  }
};

// Inicializar la aplicación
initializeApp();
