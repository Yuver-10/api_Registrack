// Middleware para validar datos de solicitudes
export const validateSolicitud = (req, res, next) => {
  const {
    id_cliente,
    id_servicio,
    id_empresa,
    total_estimado,
    pais,
    ciudad,
    codigo_postal,
    estado,
    numero_expediente,
  } = req.body;

  // Validar campos requeridos
  if (
    !id_cliente ||
    !id_servicio ||
    !id_empresa ||
    !total_estimado ||
    !pais ||
    !ciudad ||
    !codigo_postal ||
    !estado ||
    !numero_expediente
  ) {
    return res.status(400).json({
      mensaje: "Todos los campos son requeridos",
      camposFaltantes: [],
    });
  }

  // Validar tipos de datos
  if (
    typeof id_cliente !== "number" ||
    typeof id_servicio !== "number" ||
    typeof id_empresa !== "number"
  ) {
    return res.status(400).json({
      mensaje: "Los IDs deben ser números",
    });
  }

  if (typeof total_estimado !== "number" || total_estimado <= 0) {
    return res.status(400).json({
      mensaje: "El total estimado debe ser un número positivo",
    });
  }

  if (
    typeof pais !== "string" ||
    typeof ciudad !== "string" ||
    typeof estado !== "string"
  ) {
    return res.status(400).json({
      mensaje: "País, ciudad y estado deben ser texto",
    });
  }

  if (typeof codigo_postal !== "string" || codigo_postal.trim() === "") {
    return res.status(400).json({
      mensaje: "El código postal debe ser texto válido",
    });
  }

  if (typeof numero_expediente !== "string") {
    return res.status(400).json({
      mensaje: "El número de expediente debe ser texto",
    });
  }

  next();
};

// Middleware para validar edición de solicitudes
export const validateEdicionSolicitud = (req, res, next) => {
  const {
    pais,
    ciudad,
    codigo_postal,
    total_estimado,
    tipodepersona,
    tipodedocumento,
    numerodedocumento,
    nombrecompleto,
    correoelectronico,
    telefono,
    direccion,
    tipodeentidadrazonsocial,
    nombredelaempresa,
    nit,
    poderdelrepresentanteautorizado,
    poderparaelregistrodelamarca,
  } = req.body;

  // Verificar que al menos un campo editable esté presente
  const camposEditables = [
    pais,
    ciudad,
    codigo_postal,
    total_estimado,
    tipodepersona,
    tipodedocumento,
    numerodedocumento,
    nombrecompleto,
    correoelectronico,
    telefono,
    direccion,
    tipodeentidadrazonsocial,
    nombredelaempresa,
    nit,
    poderdelrepresentanteautorizado,
    poderparaelregistrodelamarca,
  ];

  const camposPresentes = camposEditables.filter(
    (campo) => campo !== undefined && campo !== null && campo !== ""
  );

  if (camposPresentes.length === 0) {
    return res.status(400).json({
      mensaje: "Debe proporcionar al menos un campo para editar",
    });
  }

  // Validar tipos de datos para campos presentes
  if (pais !== undefined && typeof pais !== "string") {
    return res.status(400).json({
      mensaje: "El país debe ser texto",
    });
  }

  if (ciudad !== undefined && typeof ciudad !== "string") {
    return res.status(400).json({
      mensaje: "La ciudad debe ser texto",
    });
  }

  if (codigo_postal !== undefined && typeof codigo_postal !== "string") {
    return res.status(400).json({
      mensaje: "El código postal debe ser texto",
    });
  }

  if (
    total_estimado !== undefined &&
    (typeof total_estimado !== "number" || total_estimado <= 0)
  ) {
    return res.status(400).json({
      mensaje: "El total estimado debe ser un número positivo",
    });
  }

  if (tipodepersona !== undefined && typeof tipodepersona !== "string") {
    return res.status(400).json({
      mensaje: "El tipo de persona debe ser texto",
    });
  }

  if (tipodedocumento !== undefined && typeof tipodedocumento !== "string") {
    return res.status(400).json({
      mensaje: "El tipo de documento debe ser texto",
    });
  }

  if (
    numerodedocumento !== undefined &&
    typeof numerodedocumento !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El número de documento debe ser texto",
    });
  }

  if (nombrecompleto !== undefined && typeof nombrecompleto !== "string") {
    return res.status(400).json({
      mensaje: "El nombre completo debe ser texto",
    });
  }

  if (
    correoelectronico !== undefined &&
    typeof correoelectronico !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El correo electrónico debe ser texto",
    });
  }

  if (telefono !== undefined && typeof telefono !== "string") {
    return res.status(400).json({
      mensaje: "El teléfono debe ser texto",
    });
  }

  if (direccion !== undefined && typeof direccion !== "string") {
    return res.status(400).json({
      mensaje: "La dirección debe ser texto",
    });
  }

  if (
    tipodeentidadrazonsocial !== undefined &&
    typeof tipodeentidadrazonsocial !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El tipo de entidad/razón social debe ser texto",
    });
  }

  if (
    nombredelaempresa !== undefined &&
    typeof nombredelaempresa !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El nombre de la empresa debe ser texto",
    });
  }

  if (nit !== undefined && typeof nit !== "string") {
    return res.status(400).json({
      mensaje: "El NIT debe ser texto",
    });
  }

  if (
    poderdelrepresentanteautorizado !== undefined &&
    typeof poderdelrepresentanteautorizado !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El poder del representante autorizado debe ser texto",
    });
  }

  if (
    poderparaelregistrodelamarca !== undefined &&
    typeof poderparaelregistrodelamarca !== "string"
  ) {
    return res.status(400).json({
      mensaje: "El poder para el registro de la marca debe ser texto",
    });
  }

  next();
};

// Middleware para validar parámetros de búsqueda
export const validateSearch = (req, res, next) => {
  const { search } = req.query;

  if (!search || search.trim() === "") {
    return res.status(400).json({
      mensaje: "El parámetro de búsqueda es requerido",
    });
  }

  next();
};

// Middleware para validar ID en parámetros
export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      mensaje: "El ID debe ser un número válido",
    });
  }

  next();
};
