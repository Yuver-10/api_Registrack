import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Servicio from "./Servicio.js";

const OrdenServicio = sequelize.define(
  "OrdenServicio",
  {
    id_orden_servicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_estimado: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "ordenes_de_servicios",
    timestamps: false,
  }
);

// Relación OrdenServicio -> Servicio
OrdenServicio.belongsTo(Servicio, {
  foreignKey: "id_servicio",
  as: "servicio",
});

Servicio.hasMany(OrdenServicio, {
  foreignKey: "id_servicio",
  as: "ordenes",
});

// Relación con User se manejará desde index.js para evitar referencias circulares

export default OrdenServicio;
