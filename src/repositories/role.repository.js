// roleRepository.js
import { Role } from '../models/index.js';
import { Permiso } from '../models/index.js';
import { Privilegio } from '../models/index.js';

const roleRepository = {
  getAllRoles: async () => {
    return Role.findAll({
      include: [
        { model: Permiso, as: 'permisos' },
        { model: Privilegio, as: 'privilegios' }
      ]
    });
  },

  getRoleById: async (id) => {
    return Role.findByPk(id, {
      include: [
        { model: Permiso, as: 'permisos' },
        { model: Privilegio, as: 'privilegios' }
      ]
    });
  }
};

export default roleRepository;
