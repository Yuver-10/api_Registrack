# 🚀 Formularios Dinámicos - Ejemplos Postman

## **Endpoint:** `POST /api/solicitudes/crear/:servicio`

**URL Base:** `http://localhost:3000/api/solicitudes/crear/`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer [tu_token]
```

---

## **1. Búsqueda de Antecedentes**

**URL:** `POST /api/solicitudes/crear/busqueda-antecedentes`

**Body:**

```json
{
  "nombre_solicitante": "Juan Pérez",
  "documento_solicitante": "12345678",
  "correo_electronico": "juan@email.com",
  "telefono": "3001234567",
  "marca_buscar": "MiMarca",
  "clase_niza": "35",
  "descripcion_adicional": "Búsqueda de antecedentes para nueva marca"
}
```

---

## **2. Certificación de Marca**

**URL:** `POST /api/solicitudes/crear/certificacion-marca`

**Body:**

```json
{
  "tipo_titular": "Natural",
  "nombre_marca": "MiMarca",
  "clase_niza": "35",
  "descripcion_marca": "Servicios de consultoría",
  "logo": "archivo_logo.pdf",
  "titular_persona_natural_nombre": "Juan Pérez",
  "titular_persona_natural_documento": "12345678",
  "titular_persona_natural_direccion": "Calle 123 #45-67",
  "titular_persona_natural_ciudad": "Bogotá",
  "titular_persona_natural_pais": "Colombia",
  "titular_persona_natural_correo": "juan@email.com",
  "titular_persona_natural_telefono": "3001234567",
  "titular_persona_juridica_razon_social": "",
  "titular_persona_juridica_nit": "",
  "representante_legal_documento": "",
  "actua_como_representante": false,
  "nombre_representante": "",
  "documento_representante": "",
  "poder": ""
}
```

---

## **3. Renovación de Marca**

**URL:** `POST /api/solicitudes/crear/renovacion-marca`

**Body:**

```json
{
  "tipo_titular": "Natural",
  "numero_registro_marca": "12345",
  "nombre_marca": "MiMarca",
  "clase_niza": "35",
  "titular_nombre_razon_social": "Juan Pérez",
  "titular_documento_nit": "12345678",
  "titular_direccion": "Calle 123 #45-67",
  "titular_ciudad": "Bogotá",
  "titular_pais": "Colombia",
  "titular_correo": "juan@email.com",
  "titular_telefono": "3001234567",
  "actua_como_representante": false,
  "nombre_representante": "",
  "documento_representante": "",
  "poder": "",
  "logo_marca": "archivo_logo.pdf"
}
```

---

## **4. Cesión de Derechos**

**URL:** `POST /api/solicitudes/crear/cesion-derechos`

**Body:**

```json
{
  "documento_nit_titular_actual": "12345678",
  "documento_nit_nuevo_titular": "87654321",
  "direccion_nuevo_titular": "Calle 456 #78-90",
  "correo_nuevo_titular": "nuevo@email.com",
  "telefono_nuevo_titular": "3008765432",
  "numero_registro_marca": "12345",
  "clase_niza": "35",
  "nombre_marca": "MiMarca",
  "documento_cesion": "archivo_cesion.pdf"
}
```

---

## **5. Oposición**

**URL:** `POST /api/solicitudes/crear/oposicion`

**Body:**

```json
{
  "nombre_opositor": "María González",
  "documento_nit_opositor": "87654321",
  "direccion": "Calle 789 #12-34",
  "ciudad": "Medellín",
  "pais": "Colombia",
  "correo": "maria@email.com",
  "telefono": "3008765432",
  "marca_conflicto": "Marca Conflicto",
  "numero_solicitud_opuesta": "67890",
  "clase_niza": "35",
  "argumentos_oposicion": "La marca es similar y puede causar confusión",
  "soportes": "archivo_soportes.pdf"
}
```

---

## **6. Respuesta a Oposición**

**URL:** `POST /api/solicitudes/crear/respuesta-oposicion`

**Body:**

```json
{
  "nombre_titular_responde": "Juan Pérez",
  "documento_nit_titular": "12345678",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá",
  "pais": "Colombia",
  "correo": "juan@email.com",
  "telefono": "3001234567",
  "numero_solicitud_registro_oposicion": "67890",
  "clase_niza": "35",
  "argumentos_respuesta": "Las marcas son diferentes y no hay confusión",
  "soportes": "archivo_respuesta.pdf"
}
```

---

## **7. Ampliación de Cobertura**

**URL:** `POST /api/solicitudes/crear/ampliacion-cobertura`

**Body:**

```json
{
  "documento_nit_titular": "12345678",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá",
  "pais": "Colombia",
  "correo": "juan@email.com",
  "telefono": "3001234567",
  "numero_registro_existente": "12345",
  "nombre_marca": "MiMarca",
  "clase_niza_actual": "35",
  "nuevas_clases_niza": "42, 45",
  "descripcion_nuevos_productos_servicios": "Servicios de diseño y consultoría legal",
  "soportes": "archivo_ampliacion.pdf"
}
```

---

## **📋 URLs para Postman:**

- `POST /api/solicitudes/crear/busqueda-antecedentes`
- `POST /api/solicitudes/crear/certificacion-marca`
- `POST /api/solicitudes/crear/renovacion-marca`
- `POST /api/solicitudes/crear/cesion-derechos`
- `POST /api/solicitudes/crear/oposicion`
- `POST /api/solicitudes/crear/respuesta-oposicion`
- `POST /api/solicitudes/crear/ampliacion-cobertura`

---

## **⚠️ Notas:**

- **El servicio va en la URL** - No en el body
- **Todos los campos son obligatorios** para cada servicio
- **La validación es automática** según el servicio en la URL
- **Rutas simplificadas** sin espacios ni caracteres especiales
