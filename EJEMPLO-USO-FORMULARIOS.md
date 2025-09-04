# Ejemplos de Uso - Sistema de Formularios Dinámicos Simplificado

## Descripción

Este sistema ahora es mucho más simple y directo. En lugar de usar una base de datos compleja, tenemos un archivo de configuración (`src/config/tiposFormularios.js`) que define todos los tipos de formularios predefinidos.

## Cómo Funciona

1. **Configuración Centralizada**: Todos los tipos de formularios están definidos en un solo archivo
2. **Validación Automática**: Según el servicio seleccionado, se validan automáticamente los campos obligatorios
3. **Sin Base de Datos**: No necesitas sincronizar tablas adicionales

## Ejemplos de Uso en Postman

### 1. Obtener Todos los Servicios con Información de Formularios

```
GET /api/formularios/servicios
```

**Respuesta esperada:**

```json
{
  "success": true,
  "mensaje": "Servicios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Registro de Marca",
      "descripcion": "Servicio para registrar marcas comerciales",
      "precio_base": 150000.0,
      "tiene_formulario": true,
      "campos_obligatorios": 10,
      "campos_opcionales": 5,
      "campos_totales": 15
    },
    {
      "id": 2,
      "nombre": "Registro de Patente",
      "descripcion": "Servicio para registrar patentes de invención",
      "precio_base": 250000.0,
      "tiene_formulario": true,
      "campos_obligatorios": 6,
      "campos_opcionales": 4,
      "campos_totales": 10
    }
  ]
}
```

### 2. Obtener Formulario para un Servicio Específico

```
GET /api/formularios/servicio/1
```

**Respuesta esperada:**

```json
{
  "success": true,
  "mensaje": "Formulario generado exitosamente",
  "data": {
    "servicio": {
      "id": 1,
      "nombre": "Registro de Marca",
      "descripcion": "Servicio para registrar marcas comerciales",
      "precio_base": 150000.0
    },
    "estructura": {
      "solicitante": {
        "nombre": "Información del Solicitante",
        "campos": [
          {
            "nombre": "tipodepersona",
            "tipo": "select",
            "etiqueta": "Tipo de Persona",
            "es_requerido": true,
            "opciones": ["natural", "juridica"]
          }
          // ... más campos
        ]
      }
      // ... más grupos
    },
    "campos_obligatorios": [
      "tipodepersona",
      "tipodedocumento",
      "numerodedocumento",
      "nombrecompleto",
      "correoelectronico",
      "telefono",
      "direccion",
      "nombre_marca",
      "clase_niza",
      "descripcion_producto"
    ],
    "campos_opcionales": [
      "tipodeentidadrazonsocial",
      "nombredelaempresa",
      "nit",
      "poderdelrepresentanteautorizado",
      "poderparaelregistrodelamarca"
    ],
    "campos_totales": 15
  }
}
```

### 3. Validar Formulario de Registro de Marca

```
POST /api/formularios/validar/1
Content-Type: application/json

{
  "tipodepersona": "natural",
  "tipodedocumento": "Cédula de Ciudadanía",
  "numerodedocumento": "12345678",
  "nombrecompleto": "Juan Pérez",
  "correoelectronico": "juan@email.com",
  "telefono": "3001234567",
  "direccion": "Calle 123 #45-67",
  "nombre_marca": "MiMarca",
  "clase_niza": "Clase 1",
  "descripcion_producto": "Productos químicos para la industria"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "mensaje": "Validación completada",
  "data": {
    "es_valido": true,
    "errores": [],
    "campos_faltantes": [],
    "servicio": "Registro de Marca",
    "campos_obligatorios": [
      "tipodepersona",
      "tipodedocumento",
      "numerodedocumento",
      "nombrecompleto",
      "correoelectronico",
      "telefono",
      "direccion",
      "nombre_marca",
      "clase_niza",
      "descripcion_producto"
    ],
    "campos_opcionales": [
      "tipodeentidadrazonsocial",
      "nombredelaempresa",
      "nit",
      "poderdelrepresentanteautorizado",
      "poderparaelregistrodelamarca"
    ]
  }
}
```

**Respuesta con errores (campos faltantes):**

```json
{
  "success": true,
  "mensaje": "Validación completada",
  "data": {
    "es_valido": false,
    "errores": [
      "El campo 'telefono' es requerido para el servicio 'Registro de Marca'",
      "El campo 'clase_niza' es requerido para el servicio 'Registro de Marca'"
    ],
    "campos_faltantes": ["telefono", "clase_niza"],
    "servicio": "Registro de Marca",
    "campos_obligatorios": [
      "tipodepersona",
      "tipodedocumento",
      "numerodedocumento",
      "nombrecompleto",
      "correoelectronico",
      "telefono",
      "direccion",
      "nombre_marca",
      "clase_niza",
      "descripcion_producto"
    ],
    "campos_opcionales": [
      "tipodeentidadrazonsocial",
      "nombredelaempresa",
      "nit",
      "poderdelrepresentanteautorizado",
      "poderparaelregistrodelamarca"
    ]
  }
}
```

### 4. Verificar si un Campo es Obligatorio

```
GET /api/formularios/verificar/Registro de Marca/telefono
```

**Respuesta:**

```json
{
  "success": true,
  "mensaje": "Verificación completada",
  "data": {
    "servicio": "Registro de Marca",
    "campo": "telefono",
    "es_obligatorio": true
  }
}
```

### 5. Obtener Todos los Campos de un Servicio

```
GET /api/formularios/campos/Registro de Marca
```

**Respuesta:**

```json
{
  "success": true,
  "mensaje": "Campos obtenidos exitosamente",
  "data": {
    "servicio": "Registro de Marca",
    "campos": [
      "tipodepersona",
      "tipodedocumento",
      "numerodedocumento",
      "nombrecompleto",
      "correoelectronico",
      "telefono",
      "direccion",
      "nombre_marca",
      "clase_niza",
      "descripcion_producto",
      "tipodeentidadrazonsocial",
      "nombredelaempresa",
      "nit",
      "poderdelrepresentanteautorizado",
      "poderparaelregistrodelamarca"
    ],
    "total_campos": 15
  }
}
```

## Diferentes Tipos de Servicios

### Registro de Marca

- **Campos obligatorios**: 10
- **Campos opcionales**: 5
- **Total**: 15 campos

### Registro de Patente

- **Campos obligatorios**: 6
- **Campos opcionales**: 4
- **Total**: 10 campos

### Registro de Derechos de Autor

- **Campos obligatorios**: 5
- **Campos opcionales**: 3
- **Total**: 8 campos

### Registro de Nombre Comercial

- **Campos obligatorios**: 5
- **Campos opcionales**: 4
- **Total**: 9 campos

## Ventajas del Sistema Simplificado

1. **Sin Base de Datos**: No necesitas sincronizar tablas adicionales
2. **Configuración Centralizada**: Todo está en un archivo fácil de modificar
3. **Validación Automática**: Los campos obligatorios se validan según el servicio
4. **Fácil de Mantener**: Agregar nuevos servicios es tan simple como editar el archivo de configuración
5. **Rápido**: No hay consultas a la base de datos para obtener la configuración

## Cómo Agregar un Nuevo Servicio

1. **Editar** `src/config/tiposFormularios.js`
2. **Agregar** la nueva configuración del servicio
3. **Definir** campos obligatorios y opcionales
4. **Crear** la estructura del formulario
5. **¡Listo!** El sistema automáticamente reconoce el nuevo servicio

## Campos Comunes vs Específicos

### Campos Comunes (siempre presentes en OrdenServicio):

- `id_cliente`, `id_servicio`, `id_empresa`
- `fecha_creacion`, `total_estimado`
- `pais`, `ciudad`, `codigo_postal`, `estado`

### Campos Específicos (definidos en la configuración):

- Cada servicio tiene sus propios campos obligatorios y opcionales
- Se validan automáticamente según el servicio seleccionado
- Se pueden agregar fácilmente sin modificar la base de datos

## Flujo de Trabajo Recomendado

1. **Obtener servicios disponibles**: `GET /api/formularios/servicios`
2. **Seleccionar servicio**: Usar el ID del servicio deseado
3. **Obtener formulario**: `GET /api/formularios/servicio/{id}`
4. **Validar datos**: `POST /api/formularios/validar/{id}` con los datos del formulario
5. **Crear orden**: Si la validación es exitosa, proceder con la creación de la orden de servicio

Este sistema es mucho más simple, rápido y fácil de mantener que la versión anterior con base de datos.

