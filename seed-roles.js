import sequelize from "./src/config/db.js";
import { Rol } from "./src/models/user_rol.js";

async function seedRoles() {
  try {
    console.log("Insertando roles básicos...");
    
    // Roles básicos del sistema
    const rolesBasicos = [
      { nombre: 'cliente' },
      { nombre: 'administrador' },
      { nombre: 'empleado' }
    ];
    
    for (const rol of rolesBasicos) {
      const [rolCreado, created] = await Rol.findOrCreate({
        where: { nombre: rol.nombre },
        defaults: rol
      });
      
      if (created) {
        console.log(` Rol '${rol.nombre}' creado exitosamente`);
      } else {
        console.log(`  Rol '${rol.nombre}' ya existe`);
      }
    }
    
    console.log("Proceso de seeding completado");
    
  } catch (error) {
    console.error("Error al insertar roles:", error);
  } finally {
    await sequelize.close();
  }
}

seedRoles();