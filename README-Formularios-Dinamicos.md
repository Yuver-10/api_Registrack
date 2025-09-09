# 🚀 Formularios Dinámicos - Módulo de Validación

## **Descripción**

Sistema de validación automática de formularios según el servicio seleccionado en la URL.

## **Endpoint Principal**

```
POST /api/solicitudes/crear/:servicio
```

## **Servicios Configurados (7)**

1. **Búsqueda de antecedentes** - 7 campos
2. **Certificación de marca** - 19 campos
3. **Renovación de marca** - 16 campos
4. **Cesión de derechos** - 9 campos
5. **Oposición** - 12 campos
6. **Respuesta a oposición** - 11 campos
7. **Ampliación de cobertura** - 12 campos

## **Funcionalidad**

- ✅ Validación automática según servicio en URL
- ✅ Todos los campos son obligatorios por servicio
- ✅ Mensajes de error claros con campos faltantes
- ✅ URLs intuitivas: `/crear/certificacion-marca`, `/crear/cesion-derechos`

## **Archivos del Módulo**

- `src/config/tiposFormularios.js` - Configuración de campos
- `src/controllers/solicitudes.controller.js` - Lógica de validación
- `src/routes/solicitudes.routes.js` - Ruta dinámica
- `EJEMPLOS-POSTMAN-SOLICITUDES.md` - Ejemplos de uso

## **Uso**

1. Seleccionar servicio en la URL
2. Enviar campos obligatorios en el body
3. Sistema valida automáticamente
4. Retorna error 400 si faltan campos
5. Crea solicitud si todo está correcto

## **Rutas Simplificadas**

- `/crear/busqueda-antecedentes`
- `/crear/certificacion-marca`
- `/crear/renovacion-marca`
- `/crear/cesion-derechos`
- `/crear/oposicion`
- `/crear/respuesta-oposicion`
- `/crear/ampliacion-cobertura`
