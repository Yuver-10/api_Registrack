import { registrarCliente, obtenerClientes, obtenerClientePorId, actualizarCliente, eliminarCliente } from "../services/cliente.service.js";
import ExcelJS from "exceljs";

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

// Reporte Excel de clientes
export const descargarReporteClientes = async (req, res) => {
  try {
    const clientes = await obtenerClientes();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    worksheet.columns = [
      { header: "ID Cliente", key: "id_cliente", width: 15 },
      { header: "Tipo Documento", key: "tipo_documento", width: 20 },
      { header: "Documento", key: "documento", width: 20 },
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Apellido", key: "apellido", width: 25 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Marca", key: "marca", width: 20 },
      { header: "Tipo Persona", key: "tipo_persona", width: 15 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Empresa", key: "empresa", width: 30 }
    ];

    clientes.forEach(cliente => {
      const empresaNombre = cliente.Empresas && cliente.Empresas.length > 0 ? 
        cliente.Empresas[0].nombre : 'No asignada';
      
      worksheet.addRow({
        id_cliente: cliente.id_cliente,
        tipo_documento: cliente.Usuario ? cliente.Usuario.tipo_documento : '',
        documento: cliente.Usuario ? cliente.Usuario.documento : '',
        nombre: cliente.Usuario ? cliente.Usuario.nombre : '',
        apellido: cliente.Usuario ? cliente.Usuario.apellido : '',
        correo: cliente.Usuario ? cliente.Usuario.correo : '',
        marca: cliente.marca || '',
        tipo_persona: cliente.tipo_persona,
        estado: cliente.estado ? 'Activo' : 'Inactivo',
        empresa: empresaNombre
      });
    });

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_clientes.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte de clientes", error: error.message });
  }
};
