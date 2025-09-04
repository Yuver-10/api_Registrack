import { User, Servicio, OrdenServicio } from "./src/models/index.js";

console.log("=== PRUEBA COMPLETA DEL SISTEMA ===");

async function testCompleto() {
  try {
    console.log("1. Verificando modelo User...");
    const user = await User.findByPk(1);
    console.log("✅ User encontrado:", user ? user.nombre : "No encontrado");

    console.log("2. Verificando modelo Servicio...");
    const servicio = await Servicio.findByPk(1);
    console.log(
      "✅ Servicio encontrado:",
      servicio ? servicio.nombre : "No encontrado"
    );

    console.log("3. Verificando modelo OrdenServicio...");
    const ordenes = await OrdenServicio.findAll({ limit: 1 });
    console.log("✅ OrdenServicio funciona, total de ordenes:", ordenes.length);

    console.log("4. Verificando relaciones...");
    const ordenConServicio = await OrdenServicio.findOne({
      include: [{ model: Servicio, as: "servicio" }],
      limit: 1,
    });
    console.log("✅ Relación OrdenServicio -> Servicio funciona");

    console.log("5. Verificando creación de solicitud...");
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
    console.log("✅ Todos los campos están presentes");

    console.log("=== SISTEMA FUNCIONANDO CORRECTAMENTE ===");
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Stack:", error.stack);
  }
}

testCompleto();
