import { SolicitudesService } from "../services/solicitudes.service.js";

const solicitudesService = new SolicitudesService();

// Función para listar todas las solicitudes
export const listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await solicitudesService.listarSolicitudes();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Función de búsqueda simplificada
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

export const verDetalleSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await solicitudesService.verDetalleSolicitud(id);
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

export const crearSolicitud = async (req, res) => {
  try {
    const resultado = await solicitudesService.crearSolicitud(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    if (error.message.includes("es requerido")) {
      res.status(400).json({ mensaje: error.message });
    } else if (error.message.includes("Ya existe una solicitud")) {
      res.status(409).json({ mensaje: error.message });
    } else {
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al crear la solicitud." });
    }
  }
};

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
