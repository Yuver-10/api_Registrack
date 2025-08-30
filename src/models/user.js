import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Rol from "./Role.js";

const User = sequelize.define("User", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_documento: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  documento: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(225),
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(225),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rol,
      key: "id_rol"
    }
  },
    estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: "usuarios",
  timestamps: false
});


export default User;
