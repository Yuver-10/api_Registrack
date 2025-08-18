import User from "./user.js";
import Rol from "./Role.js";

// 🔹 Definir asociaciones después de crear los modelos
Rol.hasMany(User, { foreignKey: "id_rol", as: "usuarios" });
User.belongsTo(Rol, { foreignKey: "id_rol", as: "rol" });

export { User, Rol };
