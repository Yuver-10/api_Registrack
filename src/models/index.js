import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

// MODELOS

// User
const User = sequelize.define(
  "User",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_documento: { type: DataTypes.STRING(10), allowNull: false },
    documento: { type: DataTypes.BIGINT, allowNull: false },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    correo: { type: DataTypes.STRING(225), allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING(225), allowNull: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

// Privilegio
const Privilegio = sequelize.define(
  "Privilegio",
  {
    id_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "privilegios",
    timestamps: false,
  }
);

// Permiso
const Permiso = sequelize.define(
  "Permiso",
  {
    id_permiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "permisos",
    timestamps: false,
  }
);

// Role
const Role = sequelize.define(
  "Role",
  {
    id_rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

// TABLA INTERMEDIA
const RolPermisoPrivilegio = sequelize.define(
  "RolPermisoPrivilegio",
  {
    id_rol: { type: DataTypes.INTEGER, primaryKey: true },
    id_permiso: { type: DataTypes.INTEGER, primaryKey: true },
    id_privilegio: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    tableName: "rol_permisos_privilegios",
    timestamps: false,
  }
);

// RELACIONES MUCHOS A MUCHOS
Role.belongsToMany(Permiso, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_rol",
  otherKey: "id_permiso",
  as: "permisos",
});
Permiso.belongsToMany(Role, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_permiso",
  otherKey: "id_rol",
  as: "roles",
});

Role.belongsToMany(Privilegio, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_rol",
  otherKey: "id_privilegio",
  as: "privilegios",
});
Privilegio.belongsToMany(Role, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_privilegio",
  otherKey: "id_rol",
  as: "roles",
});

// RELACIONES USER-ROLE
Role.hasMany(User, { foreignKey: "id_rol", as: "usuarios" });
User.belongsTo(Role, { foreignKey: "id_rol", as: "rol" });

// Importar modelo Seguimiento
import Seguimiento from "./Seguimiento.js";

// Importar modelo Servicio
import Servicio from "./Servicio.js";

// Importar modelo Proceso
import Proceso from "./Proceso.js";

// Importar modelo OrdenServicio
import OrdenServicio from "./OrdenServicio.js";

// RELACIONES USER-ORDEN_SERVICIO
User.hasMany(OrdenServicio, { foreignKey: "id_cliente", as: "ordenes" });
OrdenServicio.belongsTo(User, { foreignKey: "id_cliente", as: "cliente" });

export {
  User,
  Role,
  Permiso,
  Privilegio,
  RolPermisoPrivilegio,
  Seguimiento,
  Servicio,
  Proceso,
  OrdenServicio,
};
