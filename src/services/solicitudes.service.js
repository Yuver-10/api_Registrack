<<<<<<< HEAD
import OrdenServicio from "../models/OrdenServicio.js";
import Servicio from "../models/Servicio.js";
import { Op } from "sequelize";

export class SolicitudesService {
  constructor() {}
=======
import { SolicitudesRepository } from "../repositories/solicitudes.repository.js";
import { OrdenServicio, Servicio } from "../models/orden_servico_Servicio.js";

export class SolicitudesService {
  constructor() {
    this.repository = new SolicitudesRepository();
  }
>>>>>>> main

  // Listar solicitudes con el Servicio asociado
  async listarSolicitudes() {
    try {
      const ordenes = await OrdenServicio.findAll({
<<<<<<< HEAD
        include: [{ model: Servicio, as: "servicio" }],
=======
        include: [
          { model: Servicio, as: "servicio" } // 'as' debe coincidir con la relación definida
        ]
>>>>>>> main
      });
      return ordenes;
    } catch (error) {
      throw new Error("Error al listar solicitudes: " + error.message);
    }
  }

  // Listar solicitudes de un usuario específico (para clientes)
  async listarSolicitudesPorUsuario(idUsuario) {
    try {
      const ordenes = await OrdenServicio.findAll({
<<<<<<< HEAD
        attributes: [
          "id_orden_servicio",
          "fecha_creacion",
          "estado",
          "pais",
          "ciudad",
        ],
        where: {
          id_cliente: idUsuario,
        },
        include: [
          {
            model: Servicio,
            as: "servicio",
            attributes: ["nombre", "descripcion"],
          },
        ],
        order: [["fecha_creacion", "DESC"]],
      });
      return ordenes;
    } catch (error) {
      throw new Error(
        "Error al listar solicitudes del usuario: " + error.message
      );
    }
  }

  // Listar solicitudes en proceso de un cliente específico
  async listarSolicitudesEnProcesoPorUsuario(idUsuario) {
    try {
      const ordenes = await OrdenServicio.findAll({
        attributes: [
          "id_orden_servicio",
          "fecha_creacion",
          "estado",
          "pais",
          "ciudad",
        ],
        where: {
          id_cliente: idUsuario,
          estado: {
            [Op.notIn]: ["Anulado", "Rechazado", "Aprobado"],
          },
        },
        include: [
          {
            model: Servicio,
            as: "servicio",
            attributes: ["nombre", "descripcion"],
          },
        ],
        order: [["fecha_creacion", "DESC"]],
      });
      return ordenes;
    } catch (error) {
      throw new Error(
        "Error al listar solicitudes en proceso del usuario: " + error.message
      );
    }
  }

  // Listar solicitudes finalizadas de un cliente específico
  async listarSolicitudesFinalizadasPorUsuario(idUsuario) {
    try {
      const ordenes = await OrdenServicio.findAll({
        attributes: [
          "id_orden_servicio",
          "fecha_creacion",
          "estado",
          "pais",
          "ciudad",
        ],
        where: {
          id_cliente: idUsuario,
          estado: {
            [Op.in]: ["Anulado", "Rechazado", "Aprobado"],
          },
        },
        include: [
          {
            model: Servicio,
            as: "servicio",
            attributes: ["nombre", "descripcion"],
          },
        ],
        order: [["fecha_creacion", "DESC"]],
      });
      return ordenes;
    } catch (error) {
      throw new Error(
        "Error al listar solicitudes finalizadas del usuario: " + error.message
      );
    }
  }

  // Listar solicitudes en proceso (admin/empleado)
  async listarSolicitudesEnProceso() {
    try {
      const ordenes = await OrdenServicio.findAll({
        where: {
          estado: {
            [Op.notIn]: ["Anulado", "Rechazado", "Aprobado"],
          },
        },
        include: [{ model: Servicio, as: "servicio" }],
        order: [["fecha_creacion", "DESC"]],
      });
      return ordenes;
    } catch (error) {
      throw new Error(
        "Error al listar solicitudes en proceso: " + error.message
      );
    }
  }

  // Listar solicitudes finalizadas (admin/empleado)
  async listarSolicitudesFinalizadas() {
    try {
      const ordenes = await OrdenServicio.findAll({
        where: {
          estado: {
            [Op.in]: ["Anulado", "Rechazado", "Aprobado"],
          },
        },
        include: [{ model: Servicio, as: "servicio" }],
        order: [["fecha_creacion", "DESC"]],
      });
      return ordenes;
    } catch (error) {
      throw new Error(
        "Error al listar solicitudes finalizadas: " + error.message
      );
=======
        where: {
          id_cliente: idUsuario
        },
        include: [
          { model: Servicio, as: "servicio" }
        ]
      });
      return ordenes;
    } catch (error) {
      throw new Error("Error al listar solicitudes del usuario: " + error.message);
    }
  }

  // Buscar solicitudes
  async buscarSolicitud(search) {
    try {
      if (!search) {
        throw new Error("El parámetro de búsqueda es requerido.");
      }

      const solicitudes = await this.repository.findBySearch(search);

      if (!solicitudes || solicitudes.length === 0) {
        throw new Error("No se encontraron coincidencias.");
      }

      return solicitudes;
    } catch (error) {
      throw new Error("Error al buscar solicitudes: " + error.message);
>>>>>>> main
    }
  }

  // Ver detalle de solicitud
  async verDetalleSolicitud(id) {
    try {
<<<<<<< HEAD
      const solicitud = await OrdenServicio.findByPk(id);
=======
      const solicitud = await this.repository.findById(id);
>>>>>>> main
      if (!solicitud) {
        throw new Error("Solicitud no encontrada.");
      }
      return solicitud;
    } catch (error) {
      throw new Error("Error al ver detalle de solicitud: " + error.message);
    }
  }

  // Anular solicitud
  async anularSolicitud(id) {
    try {
<<<<<<< HEAD
      const solicitud = await OrdenServicio.findByPk(id);
      if (!solicitud) {
        throw new Error("Solicitud no encontrada.");
      }
      solicitud.estado = "Anulado";
      await solicitud.save();
=======
      const solicitud = await this.repository.updateEstado(id, "Anulado");
      if (!solicitud) {
        throw new Error("Solicitud no encontrada.");
      }
>>>>>>> main
      return { mensaje: `La solicitud ${id} ha sido anulada correctamente.` };
    } catch (error) {
      throw new Error("Error al anular la solicitud: " + error.message);
    }
  }

<<<<<<< HEAD
  // Crear nueva solicitud - ESTA ES LA FUNCIÓN PRINCIPAL
  async crearSolicitud(solicitudData) {
    try {
      console.log("Datos recibidos para crear solicitud:", solicitudData);

      // Validar campos requeridos
=======
  // Crear nueva solicitud
  async crearSolicitud(solicitudData) {
    try {
>>>>>>> main
      const camposRequeridos = [
        "id_cliente",
        "id_servicio",
        "id_empresa",
        "total_estimado",
        "pais",
        "ciudad",
        "codigo_postal",
        "estado",
<<<<<<< HEAD
        "fecha_creacion",
=======
        "numero_expediente",
>>>>>>> main
      ];

      for (const campo of camposRequeridos) {
        if (!solicitudData[campo]) {
          throw new Error(`El campo ${campo} es requerido.`);
        }
      }

<<<<<<< HEAD
      console.log("Todos los campos requeridos están presentes");

      // Crear la solicitud directamente con Sequelize
      const nuevaSolicitud = await OrdenServicio.create(solicitudData);

      console.log("Solicitud creada exitosamente:", nuevaSolicitud);
=======
      const solicitudExistente = await this.repository.findDuplicate(
        solicitudData.id_cliente,
        solicitudData.id_servicio
      );

      if (solicitudExistente) {
        throw new Error(
          "Ya existe una solicitud para este cliente y servicio. No se permiten duplicados."
        );
      }

      const nuevaSolicitud = await this.repository.create(solicitudData);
>>>>>>> main

      return {
        mensaje: "Solicitud de servicio creada exitosamente.",
        solicitud: nuevaSolicitud,
      };
    } catch (error) {
<<<<<<< HEAD
      console.error("Error en crearSolicitud:", error);
=======
>>>>>>> main
      throw new Error("Error al crear la solicitud: " + error.message);
    }
  }

  // Editar solicitud
  async editarSolicitud(id, datosActualizados) {
    try {
<<<<<<< HEAD
      const solicitudExistente = await OrdenServicio.findByPk(id);
=======
      const solicitudExistente = await this.repository.findById(id);
>>>>>>> main
      if (!solicitudExistente) {
        throw new Error("Solicitud no encontrada.");
      }

      const camposEditables = [
<<<<<<< HEAD
        "pais",
        "ciudad",
        "codigo_postal",
        "total_estimado",
        "estado",
      ];

      const camposPresentes = camposEditables.filter(
        (campo) =>
          datosActualizados[campo] !== undefined &&
          datosActualizados[campo] !== null
=======
        "pais", "ciudad", "codigo_postal", "total_estimado",
        "tipodepersona", "tipodedocumento", "numerodedocumento",
        "nombrecompleto", "correoelectronico", "telefono", "direccion",
        "tipodeentidadrazonsocial", "nombredelaempresa", "nit",
        "poderdelrepresentanteautorizado", "poderparaelregistrodelamarca"
      ];

      const camposPresentes = camposEditables.filter(
        campo => datosActualizados[campo] !== undefined && datosActualizados[campo] !== null
>>>>>>> main
      );

      if (camposPresentes.length === 0) {
        throw new Error("Debe proporcionar al menos un campo para editar.");
      }

<<<<<<< HEAD
      // Actualizar solo los campos permitidos
      for (const campo of camposPresentes) {
        solicitudExistente[campo] = datosActualizados[campo];
      }

      await solicitudExistente.save();

      return {
        mensaje: `La solicitud ${id} ha sido editada exitosamente.`,
        solicitud: solicitudExistente,
=======
      const solicitudEditada = await this.repository.editarSolicitud(id, datosActualizados);

      if (!solicitudEditada) {
        throw new Error("Error al actualizar la solicitud.");
      }

      return {
        mensaje: `La solicitud ${id} ha sido editada exitosamente.`,
        solicitud: solicitudEditada,
>>>>>>> main
      };
    } catch (error) {
      throw new Error("Error al editar la solicitud: " + error.message);
    }
  }
}
