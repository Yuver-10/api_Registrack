import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
  id_rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'roles',
  timestamps: false
});

export default Role;
