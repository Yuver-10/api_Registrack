import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import OrdenServicio from "./OrdenServicio.js";

const Seguimiento = sequelize.define(
  "Seguimiento",
  {
    id_seguimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_orden_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    documentos_adjuntos: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    registrado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "seguimientos",
    timestamps: false,
  }
);

// Relación Seguimiento -> OrdenServicio
Seguimiento.belongsTo(OrdenServicio, {
  foreignKey: "id_orden_servicio",
  as: "orden_servicio",
});
OrdenServicio.hasMany(Seguimiento, {
  foreignKey: "id_orden_servicio",
  as: "seguimientos",
});

// Nota: La relación con User se manejará desde el módulo principal
// ya que este modelo no pertenece a este módulo

export default Seguimiento;
