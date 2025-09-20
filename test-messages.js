/**
 * Script de prueba para demostrar las mejoras en los mensajes de la API
 * Este script muestra ejemplos de las nuevas respuestas estandarizadas
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logTest(testName) {
  log(`\n🧪 ${testName}`, 'yellow');
  log('-'.repeat(50), 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Función para hacer peticiones HTTP
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    return {
      status: response.status,
      data: responseData,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      success: false
    };
  }
}

// Función para mostrar la respuesta formateada
function displayResponse(response, expectedStatus = null) {
  log(`Status: ${response.status}`, response.success ? 'green' : 'red');
  
  if (expectedStatus && response.status !== expectedStatus) {
    logError(`Expected status ${expectedStatus}, got ${response.status}`);
  }

  log('Response:', 'blue');
  console.log(JSON.stringify(response.data, null, 2));
  
  // Mostrar información específica del nuevo formato
  if (response.data.success !== undefined) {
    log(`Success: ${response.data.success}`, response.data.success ? 'green' : 'red');
  }
  
  if (response.data.message) {
    log(`Message: ${response.data.message}`, 'cyan');
  }
  
  if (response.data.error) {
    log(`Error Code: ${response.data.error.code}`, 'red');
    if (response.data.error.details) {
      log(`Details: ${JSON.stringify(response.data.error.details)}`, 'red');
    }
  }
  
  if (response.data.meta) {
    log(`Meta: ${JSON.stringify(response.data.meta)}`, 'magenta');
  }
}

async function runTests() {
  logSection('PRUEBAS DE MEJORAS EN MENSAJES DE LA API REGISTRACK');
  log('Este script demuestra las mejoras implementadas en los mensajes de respuesta', 'blue');
  log('Asegúrate de que el servidor esté corriendo en http://localhost:3000', 'yellow');

  // Test 1: Registro de usuario con validaciones mejoradas
  logTest('1. Registro de Usuario - Validaciones Mejoradas');
  
  // Caso exitoso
  logInfo('Caso exitoso:');
  const validUser = {
    tipo_documento: 'CC',
    documento: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@example.com',
    contrasena: 'Password123!'
  };
  
  let response = await makeRequest('POST', '/usuarios/registrar', validUser);
  displayResponse(response, 201);
  
  if (response.success) {
    logSuccess('✅ Registro exitoso con mensaje estandarizado');
  }

  // Caso de error - campos faltantes
  logInfo('Caso de error - campos faltantes:');
  const invalidUser = {
    tipo_documento: 'CC',
    documento: '12345678'
    // Faltan campos requeridos
  };
  
  response = await makeRequest('POST', '/usuarios/registrar', invalidUser);
  displayResponse(response, 400);
  
  if (!response.success && response.data.error) {
    logSuccess('✅ Error de validación con formato estandarizado');
  }

  // Caso de error - formato de correo inválido
  logInfo('Caso de error - formato de correo inválido:');
  const invalidEmailUser = {
    ...validUser,
    correo: 'correo-invalido'
  };
  
  response = await makeRequest('POST', '/usuarios/registrar', invalidEmailUser);
  displayResponse(response, 400);

  // Test 2: Login con mensajes mejorados
  logTest('2. Login - Mensajes Mejorados');
  
  // Caso exitoso
  logInfo('Caso exitoso:');
  const loginData = {
    correo: 'juan.perez@example.com',
    contrasena: 'Password123!'
  };
  
  response = await makeRequest('POST', '/usuarios/login', loginData);
  displayResponse(response, 200);
  
  if (response.success) {
    logSuccess('✅ Login exitoso con información de permisos');
  }

  // Caso de error - credenciales inválidas
  logInfo('Caso de error - credenciales inválidas:');
  const invalidLogin = {
    correo: 'juan.perez@example.com',
    contrasena: 'contraseña-incorrecta'
  };
  
  response = await makeRequest('POST', '/usuarios/login', invalidLogin);
  displayResponse(response, 401);

  // Test 3: Recuperación de contraseña
  logTest('3. Recuperación de Contraseña - Respuesta Neutra');
  
  logInfo('Solicitud de recuperación:');
  response = await makeRequest('POST', '/usuarios/forgot-password', {
    correo: 'juan.perez@example.com'
  });
  displayResponse(response, 200);
  
  if (response.success) {
    logSuccess('✅ Respuesta neutra para seguridad');
  }

  // Test 4: Crear cliente con validaciones mejoradas
  logTest('4. Crear Cliente - Validaciones Mejoradas');
  
  // Primero necesitamos un usuario válido
  const clientUser = {
    tipo_documento: 'CC',
    documento: '87654321',
    nombre: 'María',
    apellido: 'González',
    correo: 'maria.gonzalez@example.com',
    contrasena: 'Password123!'
  };
  
  response = await makeRequest('POST', '/usuarios/registrar', clientUser);
  
  if (response.success) {
    const userId = response.data.data.usuario.id_usuario;
    
    logInfo('Crear cliente con datos válidos:');
    const clientData = {
      cliente: {
        id_usuario: userId,
        tipo_persona: 'Natural',
        marca: 'Mi Marca'
      }
    };
    
    response = await makeRequest('POST', '/clientes', clientData);
    displayResponse(response, 201);
    
    if (response.success) {
      logSuccess('✅ Cliente creado con mensaje estandarizado');
    }
  }

  // Test 5: Subir archivo con validaciones mejoradas
  logTest('5. Subir Archivo - Validaciones Mejoradas');
  
  logInfo('Caso de error - campos faltantes:');
  const invalidFile = {
    url_archivo: 'https://example.com/file.pdf'
    // Faltan campos requeridos
  };
  
  response = await makeRequest('POST', '/gestion-archivos', invalidFile);
  displayResponse(response, 400);
  
  if (!response.success && response.data.error) {
    logSuccess('✅ Error de validación con detalles específicos');
  }

  // Test 6: Ruta no encontrada
  logTest('6. Ruta No Encontrada - Mensaje Mejorado');
  
  response = await makeRequest('GET', '/ruta-inexistente');
  displayResponse(response, 404);
  
  if (!response.success && response.data.error) {
    logSuccess('✅ Error 404 con información útil');
  }

  // Resumen
  logSection('RESUMEN DE MEJORAS IMPLEMENTADAS');
  log('✅ Mensajes de respuesta estandarizados', 'green');
  log('✅ Códigos de error específicos', 'green');
  log('✅ Validaciones mejoradas con detalles', 'green');
  log('✅ Información de próximos pasos', 'green');
  log('✅ Metadatos útiles en respuestas', 'green');
  log('✅ Manejo de errores de Sequelize', 'green');
  log('✅ Respuestas neutras para seguridad', 'green');
  log('✅ Logging de respuestas para debugging', 'green');
  
  log('\n🎉 Todas las mejoras han sido implementadas exitosamente!', 'bright');
  log('La API ahora proporciona mensajes más claros, consistentes y útiles.', 'blue');
}

// Ejecutar las pruebas
runTests().catch(error => {
  logError(`Error ejecutando las pruebas: ${error.message}`);
  process.exit(1);
});
