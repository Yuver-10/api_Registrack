/**
 * Script de monitoreo para el sistema de mensajes en producción
 * Monitorea la calidad y consistencia de los mensajes de la API
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const LOG_FILE = 'message-monitoring.log';

// Configuración de monitoreo
const MONITORING_CONFIG = {
  endpoints: [
    { path: '/servicios', method: 'GET', expectedStatus: 200 },
    { path: '/usuarios/registrar', method: 'POST', expectedStatus: 400, body: {} },
    { path: '/citas', method: 'POST', expectedStatus: 400, body: {} },
    { path: '/gestion-archivos', method: 'POST', expectedStatus: 400, body: {} },
    { path: '/ruta-inexistente', method: 'GET', expectedStatus: 404 }
  ],
  interval: 60000, // 1 minuto
  maxRetries: 3
};

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
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`${colors[color]}${logMessage}${colors.reset}`);
  
  // Guardar en archivo de log
  fs.appendFile(LOG_FILE, logMessage + '\n').catch(console.error);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

// Métricas de monitoreo
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimeSum: 0,
  errorTypes: {},
  messageQuality: {
    consistentStructure: 0,
    hasTimestamps: 0,
    hasErrorCodes: 0,
    hasDescriptiveMessages: 0
  }
};

// Función para hacer petición HTTP con métricas
async function makeRequest(endpoint) {
  const startTime = Date.now();
  const { path: endpointPath, method, expectedStatus, body } = endpoint;
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpointPath}`, options);
    const responseTime = Date.now() - startTime;
    const data = await response.json();
    
    metrics.totalRequests++;
    metrics.responseTimeSum += responseTime;
    
    if (response.status === expectedStatus) {
      metrics.successfulRequests++;
      log(`✅ ${method} ${endpointPath} - ${response.status} (${responseTime}ms)`, 'green');
    } else {
      metrics.failedRequests++;
      log(`❌ ${method} ${endpointPath} - Expected ${expectedStatus}, got ${response.status} (${responseTime}ms)`, 'red');
    }
    
    // Analizar calidad del mensaje
    analyzeMessageQuality(data, response.status);
    
    return { success: response.status === expectedStatus, data, responseTime };
    
  } catch (error) {
    metrics.failedRequests++;
    const responseTime = Date.now() - startTime;
    log(`💥 ${method} ${endpointPath} - Error: ${error.message} (${responseTime}ms)`, 'red');
    return { success: false, error: error.message, responseTime };
  }
}

// Función para analizar la calidad de los mensajes
function analyzeMessageQuality(data, status) {
  // Verificar estructura consistente
  if (data.success !== undefined && data.message !== undefined) {
    metrics.messageQuality.consistentStructure++;
  }
  
  // Verificar timestamps
  if (data.meta && data.meta.timestamp) {
    metrics.messageQuality.hasTimestamps++;
  }
  
  // Verificar códigos de error
  if (data.error && data.error.code) {
    metrics.messageQuality.hasErrorCodes++;
    metrics.errorTypes[data.error.code] = (metrics.errorTypes[data.error.code] || 0) + 1;
  }
  
  // Verificar mensajes descriptivos
  if (data.message && data.message.length > 10) {
    metrics.messageQuality.hasDescriptiveMessages++;
  }
}

// Función para ejecutar un ciclo de monitoreo
async function runMonitoringCycle() {
  logSection('CICLO DE MONITOREO');
  
  const results = [];
  
  for (const endpoint of MONITORING_CONFIG.endpoints) {
    const result = await makeRequest(endpoint);
    results.push({ endpoint, result });
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

// Función para generar reporte de métricas
function generateReport() {
  const avgResponseTime = metrics.totalRequests > 0 ? 
    (metrics.responseTimeSum / metrics.totalRequests).toFixed(2) : 0;
  
  const successRate = metrics.totalRequests > 0 ? 
    ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2) : 0;
  
  const messageQualityRate = metrics.totalRequests > 0 ? 
    ((metrics.messageQuality.consistentStructure / metrics.totalRequests) * 100).toFixed(2) : 0;
  
  logSection('REPORTE DE MÉTRICAS');
  log(`📊 Total de requests: ${metrics.totalRequests}`, 'blue');
  log(`✅ Requests exitosos: ${metrics.successfulRequests}`, 'green');
  log(`❌ Requests fallidos: ${metrics.failedRequests}`, 'red');
  log(`📈 Tasa de éxito: ${successRate}%`, successRate > 90 ? 'green' : 'yellow');
  log(`⏱️  Tiempo promedio de respuesta: ${avgResponseTime}ms`, 'blue');
  log(`🎯 Calidad de mensajes: ${messageQualityRate}%`, messageQualityRate > 90 ? 'green' : 'yellow');
  
  log('\n📋 Detalles de calidad de mensajes:', 'cyan');
  log(`  - Estructura consistente: ${metrics.messageQuality.consistentStructure}/${metrics.totalRequests}`, 'blue');
  log(`  - Con timestamps: ${metrics.messageQuality.hasTimestamps}/${metrics.totalRequests}`, 'blue');
  log(`  - Con códigos de error: ${metrics.messageQuality.hasErrorCodes}/${metrics.totalRequests}`, 'blue');
  log(`  - Con mensajes descriptivos: ${metrics.messageQuality.hasDescriptiveMessages}/${metrics.totalRequests}`, 'blue');
  
  if (Object.keys(metrics.errorTypes).length > 0) {
    log('\n🚨 Tipos de errores encontrados:', 'red');
    Object.entries(metrics.errorTypes).forEach(([code, count]) => {
      log(`  - ${code}: ${count} veces`, 'red');
    });
  }
}

// Función para detectar problemas
function detectIssues() {
  const issues = [];
  
  if (metrics.totalRequests > 0) {
    const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
    if (successRate < 80) {
      issues.push('Tasa de éxito muy baja');
    }
    
    const avgResponseTime = metrics.responseTimeSum / metrics.totalRequests;
    if (avgResponseTime > 5000) {
      issues.push('Tiempo de respuesta muy alto');
    }
    
    const messageQualityRate = (metrics.messageQuality.consistentStructure / metrics.totalRequests) * 100;
    if (messageQualityRate < 90) {
      issues.push('Calidad de mensajes inconsistente');
    }
  }
  
  if (issues.length > 0) {
    log('\n⚠️  PROBLEMAS DETECTADOS:', 'yellow');
    issues.forEach(issue => log(`  - ${issue}`, 'yellow'));
  } else {
    log('\n✅ No se detectaron problemas significativos', 'green');
  }
  
  return issues;
}

// Función para enviar alertas (implementar según necesidades)
async function sendAlert(message) {
  log(`🚨 ALERTA: ${message}`, 'red');
  // Aquí se puede implementar envío de email, Slack, etc.
}

// Función principal de monitoreo
async function startMonitoring() {
  logSection('INICIANDO MONITOREO DEL SISTEMA DE MENSAJES');
  log(`🌐 Monitoreando: ${BASE_URL}`, 'blue');
  log(`⏰ Intervalo: ${MONITORING_CONFIG.interval / 1000} segundos`, 'blue');
  log(`📝 Log guardado en: ${LOG_FILE}`, 'blue');
  
  let cycleCount = 0;
  
  const monitoringInterval = setInterval(async () => {
    cycleCount++;
    log(`\n🔄 Ciclo de monitoreo #${cycleCount}`, 'magenta');
    
    try {
      await runMonitoringCycle();
      
      // Generar reporte cada 10 ciclos
      if (cycleCount % 10 === 0) {
        generateReport();
        const issues = detectIssues();
        
        if (issues.length > 0) {
          await sendAlert(`Problemas detectados: ${issues.join(', ')}`);
        }
      }
      
    } catch (error) {
      log(`💥 Error en ciclo de monitoreo: ${error.message}`, 'red');
    }
  }, MONITORING_CONFIG.interval);
  
  // Manejo de cierre graceful
  process.on('SIGINT', () => {
    log('\n👋 Deteniendo monitoreo...', 'yellow');
    clearInterval(monitoringInterval);
    generateReport();
    detectIssues();
    log('✅ Monitoreo detenido', 'green');
    process.exit(0);
  });
  
  // Ejecutar primer ciclo inmediatamente
  await runMonitoringCycle();
}

// Función para ejecutar un test único
async function runSingleTest() {
  logSection('TEST ÚNICO DEL SISTEMA DE MENSAJES');
  
  try {
    await runMonitoringCycle();
    generateReport();
    detectIssues();
  } catch (error) {
    log(`💥 Error en test: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Ejecutar según argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--test')) {
  runSingleTest();
} else if (args.includes('--help')) {
  log('Uso:', 'blue');
  log('  node monitor-messages.js          # Monitoreo continuo', 'green');
  log('  node monitor-messages.js --test   # Test único', 'green');
  log('  node monitor-messages.js --help   # Mostrar ayuda', 'green');
} else {
  startMonitoring();
}
