import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Rol = sequelize.define("Rol", {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: "roles",
  timestamps: false
});


export default Rol;
