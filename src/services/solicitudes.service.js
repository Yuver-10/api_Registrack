import { SolicitudesRepository } from "../repositories/solicitudes.repository.js";
import { OrdenServicio, Servicio } from "../models/orden_servico_Servicio.js";

export class SolicitudesService {
  constructor() {
    this.repository = new SolicitudesRepository();
  }

  // Listar solicitudes con el Servicio asociado
  async listarSolicitudes() {
    try {
      const ordenes = await OrdenServicio.findAll({
        include: [
          { model: Servicio, as: "servicio" } // 'as' debe coincidir con la relación definida
        ]
      });
      return ordenes;
    } catch (error) {
      throw new Error("Error al listar solicitudes: " + error.message);
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
    }
  }

  // Ver detalle de solicitud
  async verDetalleSolicitud(id) {
    try {
      const solicitud = await this.repository.findById(id);
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
      const solicitud = await this.repository.updateEstado(id, "Anulado");
      if (!solicitud) {
        throw new Error("Solicitud no encontrada.");
      }
      return { mensaje: `La solicitud ${id} ha sido anulada correctamente.` };
    } catch (error) {
      throw new Error("Error al anular la solicitud: " + error.message);
    }
  }

  // Crear nueva solicitud
  async crearSolicitud(solicitudData) {
    try {
      const camposRequeridos = [
        "id_cliente",
        "id_servicio",
        "id_empresa",
        "total_estimado",
        "pais",
        "ciudad",
        "codigo_postal",
        "estado",
      ];

      for (const campo of camposRequeridos) {
        if (!solicitudData[campo]) {
          throw new Error(`El campo ${campo} es requerido.`);
        }
      }

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

      return {
        mensaje: "Solicitud de servicio creada exitosamente.",
        solicitud: nuevaSolicitud,
      };
    } catch (error) {
      throw new Error("Error al crear la solicitud: " + error.message);
    }
  }

  // Editar solicitud
  async editarSolicitud(id, datosActualizados) {
    try {
      const solicitudExistente = await this.repository.findById(id);
      if (!solicitudExistente) {
        throw new Error("Solicitud no encontrada.");
      }

      const camposEditables = [
        "pais", "ciudad", "codigo_postal", "total_estimado",
        "tipodepersona", "tipodedocumento", "numerodedocumento",
        "nombrecompleto", "correoelectronico", "telefono", "direccion",
        "tipodeentidadrazonsocial", "nombredelaempresa", "nit",
        "poderdelrepresentanteautorizado", "poderparaelregistrodelamarca"
      ];

      const camposPresentes = camposEditables.filter(
        campo => datosActualizados[campo] !== undefined && datosActualizados[campo] !== null
      );

      if (camposPresentes.length === 0) {
        throw new Error("Debe proporcionar al menos un campo para editar.");
      }

      const solicitudEditada = await this.repository.editarSolicitud(id, datosActualizados);

      if (!solicitudEditada) {
        throw new Error("Error al actualizar la solicitud.");
      }

      return {
        mensaje: `La solicitud ${id} ha sido editada exitosamente.`,
        solicitud: solicitudEditada,
      };
    } catch (error) {
      throw new Error("Error al editar la solicitud: " + error.message);
    }
  }
}
