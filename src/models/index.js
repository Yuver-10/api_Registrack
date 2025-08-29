import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

// MODELOS

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

// Importar modelo Seguimiento
import Seguimiento from "./Seguimiento.js";

// Importar modelo Servicio
import Servicio from "./Servicio.js";

export {
  Role,
  Permiso,
  Privilegio,
  RolPermisoPrivilegio,
  Seguimiento,
  Servicio,
};
