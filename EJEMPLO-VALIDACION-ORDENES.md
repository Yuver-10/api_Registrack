# Ejemplos de Uso - Sistema de Validación de Órdenes de Servicio

## Descripción

Este sistema ahora es mucho más simple y directo. Solo valida que cuando crees una orden de servicio, tengas los campos obligatorios según el servicio seleccionado.

## Cómo Funciona

1. **Configuración Simple**: Solo define qué campos son obligatorios para cada servicio
2. **Validación Automática**: Cuando creas una orden, valida que tengas los campos requeridos
3. **Sin Formularios**: No genera formularios, solo valida datos

## Ejemplos de Uso en Postman

### 1. Obtener Todos los Servicios con Campos Obligatorios

```
GET /api/validacion/servicios
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
      "tiene_validacion": true,
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
      "total_campos_obligatorios": 10
    },
    {
      "id": 2,
      "nombre": "Registro de Patente",
      "descripcion": "Servicio para registrar patentes de invención",
      "precio_base": 250000.0,
      "tiene_validacion": true,
      "campos_obligatorios": [
        "tipodepersona",
        "nombrecompleto",
        "correoelectronico",
        "titulo_invencion",
        "resumen_invencion",
        "tipo_patente"
      ],
      "total_campos_obligatorios": 6
    }
  ]
}
```

### 2. Validar Orden de Servicio - Registro de Marca

```
POST /api/validacion/orden/1
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
    "total_campos_obligatorios": 10
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
    "total_campos_obligatorios": 10
  }
}
```

### 3. Validar Orden de Servicio - Registro de Patente

```
POST /api/validacion/orden/2
Content-Type: application/json

{
  "tipodepersona": "natural",
  "nombrecompleto": "María García",
  "correoelectronico": "maria@email.com",
  "titulo_invencion": "Sistema de Energía Renovable",
  "resumen_invencion": "Sistema innovador para generar energía limpia",
  "tipo_patente": "Patente de Invención"
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
    "servicio": "Registro de Patente",
    "campos_obligatorios": [
      "tipodepersona",
      "nombrecompleto",
      "correoelectronico",
      "titulo_invencion",
      "resumen_invencion",
      "tipo_patente"
    ],
    "total_campos_obligatorios": 6
  }
}
```

### 4. Verificar si un Campo es Obligatorio

```
GET /api/validacion/verificar/Registro de Marca/telefono
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

### 5. Obtener Campos Obligatorios de un Servicio

```
GET /api/validacion/campos/Registro de Marca
```

**Respuesta:**

```json
{
  "success": true,
  "mensaje": "Campos obligatorios obtenidos exitosamente",
  "data": {
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
    "total_campos": 10
  }
}
```

### 6. Obtener Configuración de Todos los Servicios

```
GET /api/validacion/configuracion
```

**Respuesta:**

```json
{
  "success": true,
  "mensaje": "Configuración de servicios obtenida exitosamente",
  "data": [
    {
      "nombre": "Registro de Marca",
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
      "total_campos_obligatorios": 10
    },
    {
      "nombre": "Registro de Patente",
      "campos_obligatorios": [
        "tipodepersona",
        "nombrecompleto",
        "correoelectronico",
        "titulo_invencion",
        "resumen_invencion",
        "tipo_patente"
      ],
      "total_campos_obligatorios": 6
    }
  ]
}
```

## Diferentes Tipos de Servicios

### Registro de Marca

- **Campos obligatorios**: 10
- **Ejemplos**: tipo de persona, documento, nombre, contacto, marca, clase de Niza, descripción

### Registro de Patente

- **Campos obligatorios**: 6
- **Ejemplos**: tipo de persona, nombre, correo, título de invención, resumen, tipo de patente

### Registro de Derechos de Autor

- **Campos obligatorios**: 5
- **Ejemplos**: nombre, correo, título de obra, tipo de obra, descripción

### Registro de Nombre Comercial

- **Campos obligatorios**: 5
- **Ejemplos**: tipo de persona, nombre, correo, nombre comercial, actividad económica

## Flujo de Trabajo para Crear Órdenes

1. **Obtener servicios disponibles**: `GET /api/validacion/servicios`
2. **Seleccionar servicio**: Usar el ID del servicio deseado
3. **Crear orden con datos**: Incluir todos los campos obligatorios
4. **Validar antes de guardar**: `POST /api/validacion/orden/{id}` con los datos
5. **Si es válido**: Proceder a guardar la orden en la base de datos
6. **Si no es válido**: Mostrar errores y pedir campos faltantes

## Ventajas del Sistema Simplificado

1. **Sin Formularios**: No genera formularios, solo valida
2. **Configuración Simple**: Solo define campos obligatorios por servicio
3. **Validación Automática**: Valida automáticamente según el servicio
4. **Fácil de Mantener**: Agregar nuevos servicios es editar un archivo
5. **Rápido**: No hay consultas complejas a la base de datos

## Cómo Agregar un Nuevo Servicio

1. **Editar** `src/config/tiposFormularios.js`
2. **Agregar** el nuevo servicio con sus campos obligatorios
3. **¡Listo!** El sistema automáticamente valida el nuevo servicio

## Campos Comunes vs Específicos

### Campos Comunes (siempre presentes en OrdenServicio):

- `id_cliente`, `id_servicio`, `id_empresa`
- `fecha_creacion`, `total_estimado`
- `pais`, `ciudad`, `codigo_postal`, `estado`

### Campos Específicos (definidos en la configuración):

- Cada servicio tiene sus propios campos obligatorios
- Se validan automáticamente según el servicio seleccionado
- Se pueden agregar fácilmente sin modificar la base de datos

Este sistema es perfecto para validar órdenes de servicio sin generar formularios innecesarios.

