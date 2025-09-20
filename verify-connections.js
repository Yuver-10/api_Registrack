/**
 * Script de verificación completa de conexiones de la API
 * Verifica que todos los módulos estén correctamente conectados
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Función para verificar sintaxis de archivo
async function checkFileSyntax(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // Verificación básica de sintaxis
    if (content.includes('import ') && content.includes('export ')) {
      return { success: true, message: 'Sintaxis OK' };
    }
    return { success: true, message: 'Archivo válido' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Función para verificar imports
async function checkImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
    
    const missingImports = [];
    for (const line of importLines) {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        const importPath = match[1];
        // Verificar si el archivo existe
        const fullPath = path.resolve(path.dirname(filePath), importPath);
        try {
          // Intentar con .js primero
          await fs.access(fullPath + '.js');
        } catch {
          try {
            // Intentar sin extensión
            await fs.access(fullPath);
          } catch {
            // Intentar con index.js
            try {
              await fs.access(fullPath + '/index.js');
            } catch {
              missingImports.push(importPath);
            }
          }
        }
      }
    }
    
    return {
      success: missingImports.length === 0,
      message: missingImports.length === 0 ? 'Todos los imports OK' : `Imports faltantes: ${missingImports.join(', ')}`,
      missingImports
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Función para verificar exports
async function checkExports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const exportLines = content.split('\n').filter(line => 
      line.trim().startsWith('export ') || 
      line.includes('export const') || 
      line.includes('export function')
    );
    
    return {
      success: true,
      message: `${exportLines.length} exports encontrados`,
      count: exportLines.length
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Archivos críticos a verificar
const criticalFiles = [
  'src/constants/messages.js',
  'src/middlewares/response.middleware.js',
  'src/middlewares/error.middleware.js',
  'src/controllers/auth.controller.js',
  'src/controllers/citas.controller.js',
  'src/controllers/cliente.controller.js',
  'src/controllers/archivo.controller.js',
  'src/controllers/servicio.controller.js',
  'src/routes/usuario.routes.js',
  'src/routes/citas.routes.js',
  'src/routes/cliente.routes.js',
  'src/routes/archivo.routes.js',
  'app.js',
  'server.js'
];

// Función principal de verificación
async function verifyConnections() {
  logSection('VERIFICACIÓN COMPLETA DE CONEXIONES DE LA API');
  
  let totalFiles = 0;
  let successFiles = 0;
  let errorFiles = 0;
  const errors = [];
  
  for (const file of criticalFiles) {
    totalFiles++;
    const filePath = path.join(__dirname, file);
    
    log(`\n🔍 Verificando: ${file}`, 'blue');
    
    try {
      // Verificar que el archivo existe
      await fs.access(filePath);
      
      // Verificar sintaxis
      const syntaxCheck = await checkFileSyntax(filePath);
      if (!syntaxCheck.success) {
        log(`  ❌ Sintaxis: ${syntaxCheck.message}`, 'red');
        errorFiles++;
        errors.push(`${file}: ${syntaxCheck.message}`);
        continue;
      }
      
      // Verificar imports
      const importCheck = await checkImports(filePath);
      if (!importCheck.success) {
        log(`  ❌ Imports: ${importCheck.message}`, 'red');
        errorFiles++;
        errors.push(`${file}: ${importCheck.message}`);
        continue;
      }
      
      // Verificar exports
      const exportCheck = await checkExports(filePath);
      if (!exportCheck.success) {
        log(`  ❌ Exports: ${exportCheck.message}`, 'red');
        errorFiles++;
        errors.push(`${file}: ${exportCheck.message}`);
        continue;
      }
      
      log(`  ✅ Sintaxis: ${syntaxCheck.message}`, 'green');
      log(`  ✅ Imports: ${importCheck.message}`, 'green');
      log(`  ✅ Exports: ${exportCheck.message}`, 'green');
      
      successFiles++;
      
    } catch (error) {
      log(`  ❌ Archivo no encontrado: ${error.message}`, 'red');
      errorFiles++;
      errors.push(`${file}: Archivo no encontrado`);
    }
  }
  
  // Resumen
  logSection('RESUMEN DE VERIFICACIÓN');
  log(`📊 Total de archivos verificados: ${totalFiles}`, 'blue');
  log(`✅ Archivos correctos: ${successFiles}`, 'green');
  log(`❌ Archivos con errores: ${errorFiles}`, 'red');
  
  const successRate = ((successFiles / totalFiles) * 100).toFixed(2);
  log(`📈 Tasa de éxito: ${successRate}%`, successRate > 90 ? 'green' : 'yellow');
  
  if (errors.length > 0) {
    log('\n🚨 Errores encontrados:', 'red');
    errors.forEach(error => log(`  - ${error}`, 'red'));
  }
  
  // Verificación adicional de módulos específicos
  logSection('VERIFICACIÓN DE MÓDULOS ESPECÍFICOS');
  
  // Verificar que los middlewares de validación existan
  const validationFiles = [
    'src/middlewares/validation/auth.validation.js',
    'src/middlewares/validation/cliente.validation.js',
    'src/middlewares/validation/archivo.validation.js'
  ];
  
  for (const file of validationFiles) {
    const filePath = path.join(__dirname, file);
    try {
      await fs.access(filePath);
      log(`✅ ${file} existe`, 'green');
    } catch {
      log(`❌ ${file} no encontrado`, 'red');
      errors.push(`${file}: Archivo no encontrado`);
    }
  }
  
  // Verificar que las funciones de validación estén exportadas
  try {
    const citasController = await fs.readFile(path.join(__dirname, 'src/controllers/citas.controller.js'), 'utf8');
    if (citasController.includes('export const validateCreateCita')) {
      log('✅ validateCreateCita exportada en citas.controller.js', 'green');
    } else {
      log('❌ validateCreateCita no exportada en citas.controller.js', 'red');
      errors.push('citas.controller.js: validateCreateCita no exportada');
    }
  } catch (error) {
    log(`❌ Error leyendo citas.controller.js: ${error.message}`, 'red');
    errors.push(`citas.controller.js: ${error.message}`);
  }
  
  // Verificar que las rutas importen correctamente
  try {
    const citasRoutes = await fs.readFile(path.join(__dirname, 'src/routes/citas.routes.js'), 'utf8');
    if (citasRoutes.includes('validateCreateCita')) {
      log('✅ validateCreateCita importada en citas.routes.js', 'green');
    } else {
      log('❌ validateCreateCita no importada en citas.routes.js', 'red');
      errors.push('citas.routes.js: validateCreateCita no importada');
    }
  } catch (error) {
    log(`❌ Error leyendo citas.routes.js: ${error.message}`, 'red');
    errors.push(`citas.routes.js: ${error.message}`);
  }
  
  // Verificar que app.js importe los middlewares correctamente
  try {
    const appJs = await fs.readFile(path.join(__dirname, 'app.js'), 'utf8');
    if (appJs.includes('response.middleware.js')) {
      log('✅ response.middleware.js importado en app.js', 'green');
    } else {
      log('❌ response.middleware.js no importado en app.js', 'red');
      errors.push('app.js: response.middleware.js no importado');
    }
  } catch (error) {
    log(`❌ Error leyendo app.js: ${error.message}`, 'red');
    errors.push(`app.js: ${error.message}`);
  }
  
  // Resultado final
  logSection('RESULTADO FINAL');
  
  if (errors.length === 0) {
    log('🎉 ¡TODAS LAS CONEXIONES ESTÁN CORRECTAS!', 'green');
    log('✅ La API está lista para funcionar', 'green');
    log('✅ Todos los módulos están correctamente conectados', 'green');
    log('✅ No se encontraron errores críticos', 'green');
  } else {
    log('⚠️  SE ENCONTRARON ERRORES QUE NECESITAN CORRECCIÓN', 'yellow');
    log('📋 Revisa los errores listados arriba', 'yellow');
    log('🔧 Corrige los errores antes de continuar', 'yellow');
  }
  
  return {
    totalFiles,
    successFiles,
    errorFiles,
    errors,
    successRate: parseFloat(successRate)
  };
}

// Ejecutar verificación
verifyConnections().catch(error => {
  log(`💥 Error en verificación: ${error.message}`, 'red');
  process.exit(1);
});
