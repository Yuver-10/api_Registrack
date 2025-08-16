// src/repositories/permisoRepository.js
import Permiso from '../models/Permiso.js';

export const createPermiso = async (permiso) => {
    return Permiso.create(permiso);
};

export const getAllPermisos = async () => {
    return Permiso.findAll();
};

export const getPermisoById = async (id) => {
    return Permiso.findByPk(id);
};

export const updatePermiso = async (id, permiso) => {
    return Permiso.update(permiso, { where: { id_permiso: id } });
};

export const deletePermiso = async (id) => {
    return Permiso.destroy({ where: { id_permiso: id } });
};
