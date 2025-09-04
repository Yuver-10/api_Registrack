import { SolicitudesService } from "../services/solicitudes.service.js";
import { validarCamposObligatorios } from "../config/tiposFormularios.js";
import { Servicio } from "../models/index.js";

const solicitudesService = new SolicitudesService();

// Mapeo de nombres de servicios simplificados a nombres reales en la BD
const MAPEO_SERVICIOS = {
  "busqueda-antecedentes": "Búsqueda de antecedentes",
  "certificacion-marca": "Certificación de marca",
  "renovacion-marca": "Renovación de marca",
  "cesion-derechos": "Cesión de derechos",
  oposicion: "Oposición de marca",
  "respuesta-oposicion": "Respuesta a oposición",
  "ampliacion-cobertura": "Ampliación de cobertura",
};

// Función para obtener el ID del servicio por nombre
async function obtenerIdServicio(nombreServicio) {
  const nombreReal = MAPEO_SERVICIOS[nombreServicio];
  if (!nombreReal) {
    throw new Error(`Servicio '${nombreServicio}' no encontrado`);
  }

  const servicio = await Servicio.findOne({
    where: { nombre: nombreReal },
  });

  if (!servicio) {
    throw new Error(`Servicio '${nombreReal}' no existe en la base de datos`);
  }

  return servicio.id_servicio;
}

// Listar todas las solicitudes
// Si es cliente, solo ve las suyas
export const listarSolicitudes = async (req, res) => {
  try {
    let solicitudes;

    if (req.user.role === "cliente") {
      solicitudes = await solicitudesService.listarSolicitudesPorUsuario(
        req.user.id_usuario
      );
    } else {
      solicitudes = await solicitudesService.listarSolicitudes();
    }

    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Listar solicitudes en proceso (solo admin/empleado)
export const listarSolicitudesEnProceso = async (req, res) => {
  try {
    const solicitudes = await solicitudesService.listarSolicitudesEnProceso();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes en proceso:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Listar solicitudes finalizadas (solo admin/empleado)
export const listarSolicitudesFinalizadas = async (req, res) => {
  try {
    const solicitudes = await solicitudesService.listarSolicitudesFinalizadas();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes finalizadas:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Listar solicitudes en proceso del cliente (solo cliente)
export const listarMisSolicitudesEnProceso = async (req, res) => {
  try {
    const solicitudes =
      await solicitudesService.listarSolicitudesEnProcesoPorUsuario(
        req.user.id_usuario
      );
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar mis solicitudes en proceso:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Listar solicitudes finalizadas del cliente (solo cliente)
export const listarMiHistorial = async (req, res) => {
  try {
    const solicitudes =
      await solicitudesService.listarSolicitudesFinalizadasPorUsuario(
        req.user.id_usuario
      );
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar mi historial:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Buscar solicitud (solo admin/empleado)
export const buscarSolicitud = async (req, res) => {
  try {
    const { search } = req.query;
    const solicitudes = await solicitudesService.buscarSolicitud(search);
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al buscar solicitudes:", error);
    if (error.message.includes("El parámetro de búsqueda es requerido")) {
      res.status(400).json({ mensaje: error.message });
    } else if (error.message.includes("No se encontraron coincidencias")) {
      res.status(404).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  }
};

// Ver detalle de una solicitud
export const verDetalleSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await solicitudesService.verDetalleSolicitud(id);

    // 🔹 Cliente solo puede ver su propia solicitud
    if (
      req.user.role === "cliente" &&
      solicitud.usuario_id !== req.user.id_usuario
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para ver esta solicitud." });
    }

    res.json(solicitud);
  } catch (error) {
    console.error("Error al ver detalle de solicitud:", error);
    if (error.message.includes("Solicitud no encontrada")) {
      res.status(404).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  }
};

// Anular solicitud (solo admin/empleado)
export const anularSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await solicitudesService.anularSolicitud(id);
    res.json(resultado);
  } catch (error) {
    console.error("Error al anular la solicitud:", error);
    if (error.message.includes("Solicitud no encontrada")) {
      res.status(404).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: error.message });
    }
  }
};

// Crear solicitud con validación dinámica según el servicio en la URL
export const crearSolicitud = async (req, res) => {
  try {
    const { servicio } = req.params;
    const datosSolicitud = req.body;

    // Obtener el ID del servicio desde la base de datos
    const idServicio = await obtenerIdServicio(servicio);

    // Validar campos obligatorios según el servicio de la URL
    // Validar campos obligatorios con lógica condicional
    const validacion = validarCamposObligatorios(servicio, datosSolicitud);

    if (!validacion.esValido) {
      return res.status(400).json({
        success: false,
        mensaje: "Campos obligatorios faltantes",
        servicio: servicio,
        campos_faltantes: validacion.camposFaltantes,
        errores: validacion.errores,
      });
    }

    // Preparar datos para la solicitud - SOLO los campos que existen en la tabla
    const nuevaSolicitud = {
      id_cliente: req.user.id_usuario,
      id_servicio: idServicio,
      id_empresa: 1,
      total_estimado: datosSolicitud.total_estimado || 100000,
      pais: datosSolicitud.pais || "Colombia",
      ciudad: datosSolicitud.ciudad || "Bogotá",
      codigo_postal: datosSolicitud.codigo_postal || 110111,
      estado: req.user.role === "cliente" ? "Inicial" : "Pendiente",
      fecha_creacion: new Date(),
    };

    // 🔹 Si es cliente, forzar estado "Inicial" y no permitir cambiarlo
    if (req.user.role === "cliente") {
      nuevaSolicitud.estado = "Inicial";
    }

    const resultado = await solicitudesService.crearSolicitud(nuevaSolicitud);

    res.status(201).json({
      success: true,
      mensaje: "Solicitud creada exitosamente",
      servicio: servicio,
      id_servicio: idServicio,
      campos_validados:
        validacion.camposFaltantes.length === 0
          ? "Todos los campos validados"
          : "Campos validados con éxito",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    if (error.message.includes("es requerido")) {
      res.status(400).json({ mensaje: error.message });
    } else if (error.message.includes("Ya existe una solicitud")) {
      res.status(409).json({ mensaje: error.message });
    } else if (
      error.message.includes("no encontrado") ||
      error.message.includes("no existe")
    ) {
      res.status(404).json({ mensaje: error.message });
    } else {
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al crear la solicitud." });
    }
  }
};

// Editar solicitud (admin/empleado)
export const editarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const resultado = await solicitudesService.editarSolicitud(
      id,
      datosActualizados
    );
    res.json(resultado);
  } catch (error) {
    console.error("Error al editar la solicitud:", error);
    if (error.message.includes("Solicitud no encontrada")) {
      res.status(404).json({ mensaje: error.message });
    } else if (error.message.includes("Debe proporcionar al menos un campo")) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(500).json({
        mensaje: "Error interno del servidor al editar la solicitud.",
      });
    }
  }
};
