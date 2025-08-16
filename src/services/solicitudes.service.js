import { SolicitudesRepository } from "../repositories/solicitudes.repository.js";

export class SolicitudesService {
  constructor() {
    this.repository = new SolicitudesRepository();
  }

  // Obtener todas las solicitudes
  async listarSolicitudes() {
    try {
      return await this.repository.findAll();
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

      if (solicitudes.length === 0) {
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
      // Validar datos requeridos
      const camposRequeridos = [
        "id_cliente",
        "id_servicio",
        "id_empresa",
        "total_estimado",
        "pais",
        "ciudad",
        "codigo_postal",
        "estado",
        "numero_expediente",
      ];

      for (const campo of camposRequeridos) {
        if (!solicitudData[campo]) {
          throw new Error(`El campo ${campo} es requerido.`);
        }
      }

      // Verificar duplicados
      const solicitudExistente = await this.repository.findDuplicate(
        solicitudData.id_cliente,
        solicitudData.id_servicio
      );

      if (solicitudExistente) {
        throw new Error(
          "Ya existe una solicitud para este cliente y servicio. No se permiten solicitudes duplicadas."
        );
      }

      // Crear la solicitud
      const nuevaSolicitud = await this.repository.create(solicitudData);

      return {
        mensaje: "Solicitud de servicio creada exitosamente.",
        solicitud: nuevaSolicitud,
      };
    } catch (error) {
      throw new Error("Error al crear la solicitud: " + error.message);
    }
  }

  // Editar solicitud de servicio
  async editarSolicitud(id, datosActualizados) {
    try {
      // Validar que la solicitud existe
      const solicitudExistente = await this.repository.findById(id);
      if (!solicitudExistente) {
        throw new Error("Solicitud no encontrada.");
      }

      // Validar campos requeridos para edición
      const camposEditables = [
        "pais",
        "ciudad",
        "codigo_postal",
        "total_estimado",
        // Campos editables para "¿Quién solicita el servicio?"
        "tipodepersona",
        "tipodedocumento",
        "numerodedocumento",
        "nombrecompleto",
        "correoelectronico",
        "telefono",
        "direccion",
        // Campos editables para información de la empresa
        "tipodeentidadrazonsocial",
        "nombredelaempresa",
        "nit",
        // Campos editables para documentos de poder
        "poderdelrepresentanteautorizado",
        "poderparaelregistrodelamarca",
      ];

      // Verificar que al menos un campo editable esté presente
      const camposPresentes = camposEditables.filter(
        (campo) =>
          datosActualizados[campo] !== undefined &&
          datosActualizados[campo] !== null
      );

      if (camposPresentes.length === 0) {
        throw new Error("Debe proporcionar al menos un campo para editar.");
      }

      // Editar la solicitud
      const solicitudEditada = await this.repository.editarSolicitud(
        id,
        datosActualizados
      );

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
