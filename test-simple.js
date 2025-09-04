import { SolicitudesService } from "./src/services/solicitudes.service.js";

const testService = new SolicitudesService();

// Datos de prueba que coinciden exactamente con la estructura de la tabla
const datosPrueba = {
  id_cliente: 1,
  id_servicio: 1,
  id_empresa: 1,
  total_estimado: 100000,
  pais: "Colombia",
  ciudad: "Bogotá",
  codigo_postal: 110111,
  estado: "Inicial",
  fecha_creacion: new Date(),
};

console.log("Datos de prueba:", datosPrueba);
console.log("Campos:", Object.keys(datosPrueba));
console.log("Total de campos:", Object.keys(datosPrueba).length);

// Verificar que todos los campos requeridos estén presentes
const camposRequeridos = [
  "id_cliente",
  "id_servicio",
  "id_empresa",
  "total_estimado",
  "pais",
  "ciudad",
  "codigo_postal",
  "estado",
  "fecha_creacion",
];

const camposFaltantes = camposRequeridos.filter((campo) => !datosPrueba[campo]);
console.log("Campos faltantes:", camposFaltantes);

if (camposFaltantes.length === 0) {
  console.log("✅ Todos los campos requeridos están presentes");
} else {
  console.log("❌ Faltan campos:", camposFaltantes);
}
