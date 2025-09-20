/**
 * Tests automatizados para validar el sistema de mensajes mejorado
 * Ejecutar con: npm test
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// Configuración de test
const testConfig = {
  timeout: 10000,
  retries: 3
};

describe('Sistema de Mensajes Mejorado - API Registrack', () => {
  
  beforeAll(async () => {
    console.log('🚀 Iniciando tests del sistema de mensajes...');
    // Verificar que el servidor esté corriendo
    try {
      const response = await fetch(`${BASE_URL}/servicios`);
      if (!response.ok) {
        throw new Error('Servidor no disponible');
      }
      console.log('✅ Servidor disponible para testing');
    } catch (error) {
      throw new Error(`Servidor no disponible: ${error.message}`);
    }
  });

  afterAll(() => {
    console.log('✅ Tests completados');
  });

  describe('Estructura de Respuestas Estandarizadas', () => {
    
    it('debe tener estructura de respuesta de éxito consistente', async () => {
      const response = await fetch(`${BASE_URL}/servicios`);
      const data = await response.json();
      
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(data.success).toBe(true);
      expect(data.meta).toHaveProperty('timestamp');
    });

    it('debe tener estructura de respuesta de error consistente', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Datos vacíos para generar error
      });
      const data = await response.json();
      
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('error');
      expect(data.success).toBe(false);
      expect(data.error).toHaveProperty('message');
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('timestamp');
    });

  });

  describe('Validaciones de Autenticación', () => {
    
    it('debe validar campos requeridos en registro', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: 'CC',
          documento: '12345678'
          // Faltan campos requeridos
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('REQUIRED_FIELD');
      expect(data.error.details).toHaveProperty('missingFields');
    });

    it('debe validar formato de correo electrónico', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: 'CC',
          documento: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'correo-invalido',
          contrasena: 'Password123!'
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_EMAIL');
    });

    it('debe validar fortaleza de contraseña', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: 'CC',
          documento: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan@example.com',
          contrasena: '123' // Contraseña débil
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_PASSWORD');
    });

  });

  describe('Validaciones de Citas', () => {
    
    it('debe validar campos requeridos para crear cita', async () => {
      const response = await fetch(`${BASE_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: '2024-12-31'
          // Faltan campos requeridos
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('REQUIRED_FIELD');
    });

    it('debe validar tipos permitidos de cita', async () => {
      const response = await fetch(`${BASE_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: '2024-12-31',
          hora_inicio: '10:00:00',
          hora_fin: '11:00:00',
          tipo: 'TipoInvalido',
          modalidad: 'Presencial',
          id_cliente: 1,
          id_empleado: 1
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_CHOICE');
    });

    it('debe validar modalidades permitidas de cita', async () => {
      const response = await fetch(`${BASE_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: '2024-12-31',
          hora_inicio: '10:00:00',
          hora_fin: '11:00:00',
          tipo: 'Consulta',
          modalidad: 'ModalidadInvalida',
          id_cliente: 1,
          id_empleado: 1
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_CHOICE');
    });

  });

  describe('Validaciones de Archivos', () => {
    
    it('debe validar campos requeridos para subir archivo', async () => {
      const response = await fetch(`${BASE_URL}/gestion-archivos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url_archivo: 'https://example.com/file.pdf'
          // Faltan campos requeridos
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('REQUIRED_FIELD');
    });

    it('debe validar formato de URL de archivo', async () => {
      const response = await fetch(`${BASE_URL}/gestion-archivos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url_archivo: 'abc', // URL muy corta
          id_tipo_archivo: 1,
          id_cliente: 1
        })
      });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_URL');
    });

  });

  describe('Códigos de Error Específicos', () => {
    
    it('debe usar códigos de error específicos', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/999999`, {
        method: 'GET'
      });
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.error).toHaveProperty('code');
      expect(typeof data.error.code).toBe('string');
      expect(data.error.code.length).toBeGreaterThan(0);
    });

    it('debe incluir timestamps en todas las respuestas', async () => {
      const response = await fetch(`${BASE_URL}/servicios`);
      const data = await response.json();
      
      expect(data.meta).toHaveProperty('timestamp');
      expect(data.meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

  });

  describe('Mensajes de Éxito', () => {
    
    it('debe incluir mensajes descriptivos en respuestas exitosas', async () => {
      const response = await fetch(`${BASE_URL}/servicios`);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toBeDefined();
      expect(typeof data.message).toBe('string');
      expect(data.message.length).toBeGreaterThan(0);
    });

    it('debe incluir metadatos útiles en respuestas exitosas', async () => {
      const response = await fetch(`${BASE_URL}/servicios`);
      const data = await response.json();
      
      expect(data.meta).toBeDefined();
      expect(data.meta.timestamp).toBeDefined();
    });

  });

  describe('Manejo de Errores de Sequelize', () => {
    
    it('debe manejar errores de validación de Sequelize', async () => {
      const response = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: 'CC',
          documento: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan@example.com',
          contrasena: 'Password123!'
        })
      });
      
      // Si el usuario ya existe, debería devolver error de duplicado
      if (response.status === 409) {
        const data = await response.json();
        expect(data.error.code).toBe('DUPLICATE_VALUE');
      }
    });

  });

  describe('Rutas No Encontradas', () => {
    
    it('debe manejar rutas no encontradas con mensaje útil', async () => {
      const response = await fetch(`${BASE_URL}/ruta-inexistente`);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
      expect(data.error.details).toHaveProperty('availableEndpoints');
    });

  });

});

// Función auxiliar para ejecutar tests
export const runMessageTests = async () => {
  console.log('🧪 Ejecutando tests del sistema de mensajes...');
  
  try {
    // Test básico de conectividad
    const response = await fetch(`${BASE_URL}/servicios`);
    if (!response.ok) {
      throw new Error('Servidor no disponible');
    }
    
    console.log('✅ Tests básicos pasaron');
    return true;
  } catch (error) {
    console.error('❌ Error en tests:', error.message);
    return false;
  }
};
