import { Op } from "sequelize";
import Cita from "../models/citas.js";
import User from "../models/user.js";
import ExcelJS from "exceljs";

export const getCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                {
                    model: User,
                    as: 'Cliente',
                    attributes: ['id_usuario', 'documento', 'nombre', 'apellido']
                },
                {
                    model: User,
                    as: 'Empleado',
                    attributes: ['id_usuario', 'nombre', 'apellido']
                }
            ]
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCita = async (req, res) => {
    const { fecha, hora_inicio, hora_fin, tipo, modalidad, id_cliente, id_empleado, observacion } = req.body;
    let { estado } = req.body;

    // 1. Field Validation
    const requiredFields = ['fecha', 'hora_inicio', 'hora_fin', 'tipo', 'modalidad', 'id_cliente', 'id_empleado'];
    const missingFields = [];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    }
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Los siguientes campos son obligatorios:",
            campos_faltantes: missingFields
        });
    }

    // Date format validation
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(fecha)) {
        return res.status(400).json({ message: "El formato de la fecha debe ser YYYY-MM-DD." });
    }

    // Time format validation
    const timeFormat = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeFormat.test(hora_inicio)) {
        return res.status(400).json({ message: `El formato de la hora_inicio debe ser HH:MM:SS.` });
    }
    if (!timeFormat.test(hora_fin)) {
        return res.status(400).json({ message: `El formato de la hora_fin debe ser HH:MM:SS.` });
    }

    // If estado is not provided or is empty, use the default value
    if (!estado) {
        estado = 'Programada';
    }

    console.log("Creating cita with data:", req.body);

    try {
        // 2. Date Validation
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight
        const requestedDate = new Date(fecha);

        if (requestedDate < today) {
            return res.status(400).json({ message: "No se puede crear una cita en una fecha anterior a hoy." });
        }

        // 2. Time Validation
        const startTime = new Date(`1970-01-01T${hora_inicio}`);
        const endTime = new Date(`1970-01-01T${hora_fin}`);
        const openingTime = new Date(`1970-01-01T07:00:00`);
        const closingTime = new Date(`1970-01-01T18:00:00`);

        if (startTime < openingTime || endTime > closingTime) {
            return res.status(400).json({ message: "Las citas solo se pueden agendar entre las 7:00 AM y las 6:00 PM." });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "La hora de inicio debe ser anterior a la hora de fin." });
        }

        // 4. Overlap Validation
        console.log("Checking for existing appointments with overlap...");
        const existingCita = await Cita.findOne({
            where: {
                fecha,
                id_empleado,
                hora_inicio: {
                    [Op.lt]: hora_fin
                },
                hora_fin: {
                    [Op.gt]: hora_inicio
                }
            },
            logging: console.log // Log the generated SQL query
        });

        console.log("Found existing cita:", existingCita);

        if (existingCita) {
            return res.status(400).json({ message: "Ya existe una cita agendada en ese horario para el empleado seleccionado." });
        }

        const newCita = await Cita.create({
            fecha,
            hora_inicio,
            hora_fin,
            tipo,
            modalidad,
            estado,
            id_cliente,
            id_empleado,
            observacion
        });
        res.status(201).json(newCita);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => {
                let customMessage = `Error en el campo '${err.path}': ${err.message}`;
                switch (err.validatorKey) {
                    case 'isIn':
                        customMessage = `El valor '${err.value}' no es válido para el campo '${err.path}'. Los valores permitidos son: ${err.validatorArgs[0].join(', ')}.`;
                        break;
                    case 'isDate':
                    case 'isDateOnly':
                        customMessage = `El valor '${err.value}' no es una fecha válida para el campo '${err.path}'. Asegúrate de que el formato sea YYYY-MM-DD.`;
                        break;
                    // Add more cases for other validators if needed
                }
                return customMessage;
            });
            return res.status(400).json({ message: "Error de validación", errors: messages });
        }
        res.status(500).json({ message: error.message });
    }
};

export const reprogramarCita = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.body;

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada." });
        }

        // Check if the appointment is canceled
        if (cita.estado === 'Anulada') {
            return res.status(400).json({ message: "No se puede reprogramar una cita que ha sido anulada." });
        }

        // Validations (similar to createCita)
        // Date format validation
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (fecha && !dateFormat.test(fecha)) {
            return res.status(400).json({ message: "El formato de la fecha debe ser YYYY-MM-DD." });
        }

        // Time format validation
        const timeFormat = /^\d{2}:\d{2}:\d{2}$/;
        if (hora_inicio && !timeFormat.test(hora_inicio)) {
            return res.status(400).json({ message: `El formato de la hora_inicio debe ser HH:MM:SS.` });
        }
        if (hora_fin && !timeFormat.test(hora_fin)) {
            return res.status(400).json({ message: `El formato de la hora_fin debe ser HH:MM:SS.` });
        }
        
        const newFecha = fecha || cita.fecha;
        const newHoraInicio = hora_inicio || cita.hora_inicio;
        const newHoraFin = hora_fin || cita.hora_fin;

        // Date in the past validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const requestedDate = new Date(newFecha);
        if (requestedDate < today) {
            return res.status(400).json({ message: "No se puede reprogramar una cita a una fecha anterior a hoy." });
        }

        // Time within working hours validation
        const startTime = new Date(`1970-01-01T${newHoraInicio}`);
        const endTime = new Date(`1970-01-01T${newHoraFin}`);
        const openingTime = new Date(`1970-01-01T07:00:00`);
        const closingTime = new Date(`1970-01-01T18:00:00`);

        if (startTime < openingTime || endTime > closingTime) {
            return res.status(400).json({ message: "Las citas solo se pueden agendar entre las 7:00 AM y las 6:00 PM." });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "La hora de inicio debe ser anterior a la hora de fin." });
        }

        // Overlap validation
        const existingCita = await Cita.findOne({
            where: {
                id_cita: { [Op.ne]: id }, // Exclude the current appointment
                fecha: newFecha,
                id_empleado: cita.id_empleado,
                hora_inicio: { [Op.lt]: newHoraFin },
                hora_fin: { [Op.gt]: newHoraInicio }
            }
        });

        if (existingCita) {
            return res.status(400).json({ message: "Ya existe una cita agendada en ese horario para el empleado seleccionado." });
        }

        cita.fecha = newFecha;
        cita.hora_inicio = newHoraInicio;
        cita.hora_fin = newHoraFin;
        cita.estado = 'Reprogramada';
        await cita.save();

        res.json({ message: "Cita reprogramada exitosamente.", cita });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const anularCita = async (req, res) => {
    const { id } = req.params;

    try {
        // Check for body and observacion
        if (!req.body || !req.body.observacion) {
            return res.status(400).json({ message: "Se requiere una observación para anular la cita." });
        }
        const { observacion } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada." });
        }

        // Check if the appointment is already canceled
        if (cita.estado === 'Anulada') {
            return res.status(400).json({ message: "Esta cita ya ha sido anulada." });
        }

        cita.estado = 'Anulada';
        cita.observacion = observacion;
        await cita.save();

        res.json({ message: "Cita anulada exitosamente.", cita });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reporte Excel de citas
export const descargarReporteCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                {
                    model: User,
                    as: 'Cliente',
                    attributes: ['id_usuario', 'documento', 'nombre', 'apellido']
                },
                {
                    model: User,
                    as: 'Empleado',
                    attributes: ['id_usuario', 'nombre', 'apellido']
                }
            ]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Citas");

        worksheet.columns = [
            { header: "ID Cita", key: "id_cita", width: 10 },
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Hora Inicio", key: "hora_inicio", width: 15 },
            { header: "Hora Fin", key: "hora_fin", width: 15 },
            { header: "Tipo", key: "tipo", width: 15 },
            { header: "Modalidad", key: "modalidad", width: 15 },
            { header: "Estado", key: "estado", width: 15 },
            { header: "Cliente", key: "cliente", width: 25 },
            { header: "Empleado", key: "empleado", width: 25 },
            { header: "Observación", key: "observacion", width: 30 }
        ];

        citas.forEach(cita => {
            worksheet.addRow({
                id_cita: cita.id_cita,
                fecha: cita.fecha,
                hora_inicio: cita.hora_inicio,
                hora_fin: cita.hora_fin,
                tipo: cita.tipo,
                modalidad: cita.modalidad,
                estado: cita.estado,
                cliente: cita.Cliente ? `${cita.Cliente.nombre} ${cita.Cliente.apellido}` : 'No asignado',
                empleado: cita.Empleado ? `${cita.Empleado.nombre} ${cita.Empleado.apellido}` : 'No asignado',
                observacion: cita.observacion || ''
            });
        });

        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center" };
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_citas.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Error al generar el reporte de citas", error: error.message });
    }
};