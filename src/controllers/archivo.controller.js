import Archivo from "../models/Archivo.js";
import TipoArchivo from "../models/TipoArchivo.js";
import Cliente from "../models/Cliente.js";
import OrdenServicio from "../models/OrdenServicio.js";

export const upload = async (req, res) => {
  try {
    const { url_archivo, id_tipo_archivo, id_cliente, id_orden_servicio } = req.body;
    // FK checks
    const tipo = await TipoArchivo.findByPk(id_tipo_archivo);
    if (!tipo) return res.status(404).json({ mensaje: "Tipo de archivo no encontrado" });
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });
    if (id_orden_servicio) {
      const orden = await OrdenServicio.findByPk(id_orden_servicio);
      if (!orden) return res.status(404).json({ mensaje: "Orden de servicio no encontrada" });
    }
    const creado = await Archivo.create({ url_archivo, id_tipo_archivo, id_cliente, id_orden_servicio });
    res.status(201).json({ mensaje: "Archivo registrado correctamente", data: creado });
  } catch (err) {
    res.status(400).json({ mensaje: "No fue posible registrar el archivo", error: err.message });
  }
};

export const download = async (req, res) => {
  try {
    const archivo = await Archivo.findByPk(req.params.id);
    if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });
    res.json({ mensaje: "URL obtenida", url: archivo.url_archivo });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener el archivo", error: err.message });
  }
};

export const listByCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const archivos = await Archivo.findAll({ where: { id_cliente: idCliente } });
    res.json({ mensaje: "Archivos del cliente", data: archivos });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar archivos", error: err.message });
  }
};


