import servicioService from "../services/servicio.service.js";

// Obtener todos los servicios
export const getAllServicios = async (req, res) => {
  try {
    const result = await servicioService.getAllServicios();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener servicio por ID
export const getServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await servicioService.getServicioById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener servicio:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Obtener detalle completo de servicio
export const getDetalleServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await servicioService.getDetalleServicio(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener detalle de servicio:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Buscar servicios por nombre
export const buscarServiciosPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    const result = await servicioService.buscarPorNombre(nombre);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al buscar servicios:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Actualizar servicio (datos de landing page)
export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const result = await servicioService.actualizarServicio(
      id,
      datosActualizados
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Obtener procesos de un servicio
export const obtenerProcesos = async (req, res) => {
  try {
    const { idServicio } = req.params;
    const result = await servicioService.obtenerProcesos(idServicio);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener procesos:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Actualizar procesos de un servicio
export const actualizarProcesos = async (req, res) => {
  try {
    const { idServicio } = req.params;
    const { procesos } = req.body;

    const result = await servicioService.actualizarProcesos(
      idServicio,
      procesos
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar procesos:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Ocultar servicio
export const ocultarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await servicioService.ocultarServicio(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ocultar servicio:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Publicar servicio
export const publicarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await servicioService.publicarServicio(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al publicar servicio:", error);
    if (error.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Obtener todos los servicios (incluyendo ocultos) - para admin
export const getAllServiciosAdmin = async (req, res) => {
  try {
    const result = await servicioService.getAllServiciosAdmin();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener servicios admin:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
