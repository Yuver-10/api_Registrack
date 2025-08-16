import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Servicio = sequelize.define(
  "Servicio",
  {
    id_servicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio_base: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: "servicios",
    timestamps: false,
  }
);

export default Servicio;
