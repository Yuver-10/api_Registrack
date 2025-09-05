import { SolicitudesService } from "../services/solicitudes.service.js";
import { OrdenServicio, Servicio } from "../models/orden_servico_Servicio.js";

const solicitudesService = new SolicitudesService();

// Estados válidos para órdenes de servicio (según la base de datos):
// - "Pendiente": Estado inicial de la orden
// - "Aprobada": Orden aprobada por administrador
// - "Rechazada": Orden rechazada por administrador
// - "Anulado": Orden anulada

// Configuración de campos requeridos por servicio
const requiredFields = {
  "Búsqueda de antecedentes": [
    "nombre_solicitante",
    "documento_solicitante",
    "correo_electronico",
    "telefono",
    "marca_a_buscar",
    "clase_niza",
    "descripcion_adicional",
  ],
  "Certificación de marca": [
    "tipo_titular",
    "nombre_marca",
    "clase_niza",
    "descripcion_marca",
    "logo",
    "nombre_completo_titular",
    "documento_identidad_titular",
    "direccion_titular",
    "ciudad_titular",
    "pais_titular",
    "correo_titular",
    "telefono_titular",
    "razon_social",
    "nit",
    "representante_legal",
    "documento_representante_legal",
    "nombre_representante",
    "documento_representante",
    "poder",
  ],
  "Renovación de marca": [
    "tipo_titular",
    "numero_registro_marca",
    "nombre_marca",
    "clase_niza",
    "nombre_razon_social",
    "documento_nit",
    "direccion",
    "ciudad",
    "pais",
    "correo",
    "telefono",
    "nombre_representante",
    "documento_representante",
    "poder",
    "logo_marca",
  ],
  "Cesión de derechos": [
    "titular_actual",
    "documento_nit_titular_actual",
    "nuevo_titular",
    "documento_nit_nuevo_titular",
    "direccion_nuevo_titular",
    "correo_nuevo_titular",
    "telefono_nuevo_titular",
    "numero_registro_marca",
    "clase_niza",
    "nombre_marca",
    "documento_cesion",
  ],
  "Oposición de marca": [
    "nombre_opositor",
    "documento_nit_opositor",
    "direccion",
    "ciudad",
    "pais",
    "correo",
    "telefono",
    "marca_en_conflicto",
    "numero_solicitud_opuesta",
    "clase_niza",
    "argumentos_oposicion",
    "soportes",
  ],
  "Respuesta a oposición": [
    "nombre_titular_que_responde",
    "documento_nit_titular",
    "direccion",
    "ciudad",
    "pais",
    "correo",
    "telefono",
    "numero_solicitud_registro",
    "clase_niza",
    "argumentos_respuesta",
    "soportes",
  ],
  "Ampliación de cobertura": [
    "titular",
    "documento_nit_titular",
    "direccion",
    "ciudad",
    "pais",
    "correo",
    "telefono",
    "numero_registro_existente",
    "nombre_marca",
    "clase_niza_actual",
    "nuevas_clases_niza",
    "descripcion_nuevos_productos_servicios",
    "soportes",
  ],
  "Respuesta a oposición": [
    "nombre_titular_que_responde",
    "documento_nit_titular",
    "direccion",
    "ciudad",
    "pais",
    "correo",
    "telefono",
    "numero_solicitud_registro",
    "clase_niza",
    "argumentos_respuesta",
    "soportes",
  ],
};

// Función principal para crear solicitud dinámica
export const crearSolicitud = async (req, res) => {
  try {
    // Obtener el nombreServicio de los parámetros de la URL
    let nombreServicio = req.params.servicio;

    // Mock user temporal para pruebas
    if (!req.user) {
      req.user = { id_usuario: 1, role: "cliente" };
    }

    // Decodificar URL y limpiar espacios
    nombreServicio = decodeURIComponent(nombreServicio).trim();

    // Buscar el servicio de forma insensible a mayúsculas/minúsculas y caracteres especiales
    const servicioEncontrado = Object.keys(requiredFields).find((key) => {
      const keyNormalized = key
        .toLowerCase()
        .replace(/[ó]/g, "o")
        .replace(/[í]/g, "i");
      const nombreNormalized = nombreServicio
        .toLowerCase()
        .replace(/[ó]/g, "o")
        .replace(/[í]/g, "i");
      return keyNormalized === nombreNormalized;
    });

    if (!servicioEncontrado) {
      return res.status(404).json({
        mensaje: "Servicio no encontrado",
        servicio: nombreServicio,
        serviciosDisponibles: Object.keys(requiredFields),
      });
    }

    // Determinar campos requeridos según el rol del usuario
    let camposRequeridos = [...requiredFields[servicioEncontrado]];

    // Si es cliente, agregar campos de pago como obligatorios
    if (req.user.role === "cliente") {
      camposRequeridos.push("metodo_pago", "monto_pago");
    }

    // Validar campos requeridos en el body
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo] || req.body[campo].toString().trim() === ""
    );

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        mensaje: "Faltan campos requeridos para este servicio",
        servicio: servicioEncontrado,
        rol_usuario: req.user.role,
        camposFaltantes: camposFaltantes,
        camposRequeridos: camposRequeridos,
        nota:
          req.user.role === "cliente"
            ? "Los clientes deben incluir información de pago"
            : "Los administradores no requieren pago",
      });
    }

    // Buscar el servicio en la base de datos por nombre
    const servicio = await Servicio.findOne({
      where: { nombre: servicioEncontrado },
    });

    if (!servicio) {
      return res.status(404).json({
        mensaje: "Servicio no encontrado en la base de datos",
        servicio: servicioEncontrado,
      });
    }

    // Mapear los campos específicos del servicio a los campos de la base de datos
    const mapearCamposServicio = (body, nombreServicio, rolUsuario) => {
      const mapeo = {
        // Campos comunes que se mapean directamente
        id_empresa: body.id_empresa || 1,
        total_estimado: body.total_estimado || body.monto_pago || 0,
        pais:
          body.pais || body.pais_titular || body.ciudad_titular || "Colombia",
        ciudad: body.ciudad || body.ciudad_titular || "Bogotá",
        codigo_postal: body.codigo_postal || "110111",
        estado: "Pendiente",
        numero_expediente: body.numero_expediente || `EXP-${Date.now()}`,

        // Campos de información personal/empresarial
        tipodepersona: body.tipo_titular || body.tipodepersona,
        tipodedocumento: body.tipo_titular === "Natural" ? "CC" : "NIT",
        numerodedocumento:
          body.documento_solicitante ||
          body.documento_identidad_titular ||
          body.documento_nit ||
          body.documento_nit_titular,
        nombrecompleto:
          body.nombre_solicitante ||
          body.nombre_completo_titular ||
          body.nombre_opositor ||
          body.nombre_titular_que_responde ||
          body.titular,
        correoelectronico:
          body.correo_electronico ||
          body.correo_titular ||
          body.correo ||
          body.correo_nuevo_titular,
        telefono:
          body.telefono || body.telefono_titular || body.telefono_nuevo_titular,
        direccion:
          body.direccion ||
          body.direccion_titular ||
          body.direccion_nuevo_titular,

        // Campos empresariales
        tipodeentidadrazonsocial:
          body.tipodeentidadrazonsocial || body.razon_social,
        nombredelaempresa: body.nombredelaempresa || body.nombre_razon_social,
        nit:
          body.nit ||
          body.documento_nit ||
          body.documento_nit_titular_actual ||
          body.documento_nit_nuevo_titular ||
          body.documento_nit_opositor,

        // Campos de poder
        poderdelrepresentanteautorizado:
          body.poder || body.poderdelrepresentanteautorizado,
        poderparaelregistrodelamarca:
          body.poder || body.poderparaelregistrodelamarca,
      };

      return mapeo;
    };

    // Crear la orden de servicio
    const datosOrdenServicio = {
      id_cliente: req.user.id_usuario, // Obtener del token de autenticación
      id_servicio: servicio.id_servicio,
      ...mapearCamposServicio(req.body, servicioEncontrado, req.user.role),
    };

    // Crear la orden en la base de datos
    const nuevaOrden = await OrdenServicio.create(datosOrdenServicio);

    // Responder con éxito
    res.status(201).json({
      mensaje: "Orden de servicio creada exitosamente",
      orden: {
        id_orden_servicio: nuevaOrden.id_orden_servicio,
        numero_expediente: nuevaOrden.numero_expediente,
        servicio: servicioEncontrado,
        estado: nuevaOrden.estado,
        fecha_creacion: nuevaOrden.fecha_creacion,
        total_estimado: nuevaOrden.total_estimado,
      },
      informacion_pago: {
        rol_usuario: req.user.role,
        requiere_pago: req.user.role === "cliente",
        metodo_pago: req.body.metodo_pago || null,
        monto: req.body.monto_pago || nuevaOrden.total_estimado,
      },
      datosEnviados: req.body,
    });
  } catch (error) {
    console.error("Error al crear orden de servicio:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación en los datos",
        errores: error.errors.map((err) => ({
          campo: err.path,
          mensaje: err.message,
        })),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        mensaje: "Ya existe una orden con estos datos",
        error: error.message,
      });
    }

    res.status(500).json({
      mensaje: "Error interno del servidor al crear la orden de servicio",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno",
    });
  }
};

// Listar todas las solicitudes
// Si es cliente, solo ve las suyas
export const listarSolicitudes = async (req, res) => {
  try {
    let solicitudes;

    if (req.user.role === "cliente") {
      solicitudes = await solicitudesService.listarSolicitudesPorUsuario(
        req.user.id
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
    if (req.user.role === "cliente" && solicitud.usuario_id !== req.user.id) {
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

// Crear solicitud básica (cliente/admin/empleado)
export const crearSolicitudBasica = async (req, res) => {
  try {
    // Forzamos que el userId venga del token, no del body
    const nuevaSolicitud = {
      ...req.body,
      usuario_id: req.user.id,
    };

    const resultado = await solicitudesService.crearSolicitud(nuevaSolicitud);
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
