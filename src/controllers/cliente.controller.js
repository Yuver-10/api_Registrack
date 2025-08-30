import { registrarCliente, obtenerClientes, obtenerClientePorId, actualizarCliente, eliminarCliente } from "../services/cliente.service.js";

// CREATE
export const crearCliente = async (req, res) => {
  try {
    const { cliente, empresa } = await registrarCliente(req.body.cliente, req.body.empresa);
    res.status(201).json({ message: "Cliente registrado correctamente", cliente, empresa });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar cliente", error: error.message });
  }
};

// READ - todos
export const listarClientes = async (req, res) => {
  try {
    const clientes = await obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};

// READ - uno
export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await obtenerClientePorId(req.params.id);
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cliente", error: error.message });
  }
};

// UPDATE
export const editarCliente = async (req, res) => {
  try {
    const cliente = await actualizarCliente(req.params.id, req.body);
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente actualizado", cliente });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
  }
};

// DELETE
export const borrarCliente = async (req, res) => {
  try {
    const cliente = await eliminarCliente(req.params.id);
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente eliminado", cliente });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
  }
};
