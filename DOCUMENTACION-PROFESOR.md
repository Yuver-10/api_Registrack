# 📚 Documentación Completa - API Registrack v4

## 🎯 Información General

**API de Gestión de Solicitudes de Servicios Legales** - Sistema completo para manejo de formularios dinámicos, autenticación, gestión de usuarios, empresas, clientes y servicios.

**Desarrollado por:** [Tu Nombre]  
**Versión:** 4.0  
**Tecnologías:** Node.js, Express, MySQL, Sequelize, JWT

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Autenticación y Autorización](#autenticación-y-autorización)
6. [Endpoints Principales](#endpoints-principales)
7. [Formularios Dinámicos](#formularios-dinámicos)
8. [Ejemplos de Uso con Postman](#ejemplos-de-uso-con-postman)
9. [Códigos de Respuesta](#códigos-de-respuesta)
10. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos del Sistema

### Software Necesario:

- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **Git** (para clonar el repositorio)
- **Postman** (para probar la API)

### Hardware Mínimo:

- RAM: 4GB
- Espacio en disco: 2GB libres
- Conexión a internet (para instalar dependencias)

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd api_Registrack
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Configuración de Base de Datos
DB_NAME=registrack_db
DB_USER=root
DB_PASS=tu_contraseña_mysql
DB_HOST=localhost
DB_PORT=3306

# Configuración del Servidor
PORT=3000

# JWT Secret (cambiar por una clave segura)
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura

# Configuración de Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_email
```

### Paso 4: Configurar Base de Datos

1. **Crear la base de datos en MySQL:**

```sql
CREATE DATABASE registrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Sincronizar modelos con la base de datos:**

```bash
npm run sync-db
```

3. **Crear roles iniciales:**

```bash
npm run seed-roles
```

4. **Crear usuario administrador:**

```bash
npm run create-admin
```

### Paso 5: Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

**El servidor estará disponible en:** `http://localhost:3000`

---

## 🗄️ Configuración de Base de Datos

### Estructura de Tablas Principales:

- **usuarios** - Gestión de usuarios del sistema
- **roles** - Roles y permisos
- **empresas** - Información de empresas
- **clientes** - Datos de clientes
- **servicios** - Catálogo de servicios
- **ordenes_de_servicios** - Solicitudes de servicios
- **citas** - Sistema de citas
- **empleados** - Gestión de empleados
- **seguimiento** - Seguimiento de solicitudes

### Scripts Disponibles:

```bash
# Sincronizar base de datos
npm run sync-db

# Crear roles iniciales
npm run seed-roles

# Crear usuario administrador
npm run create-admin
```

---

## 📁 Estructura del Proyecto

```
api_Registrack/
├── src/
│   ├── config/          # Configuración de BD y formularios
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Middlewares de autenticación y validación
│   ├── models/          # Modelos de Sequelize
│   ├── repositories/    # Acceso a datos
│   ├── routes/          # Definición de rutas
│   └── services/        # Servicios de negocio
├── server.js           # Punto de entrada del servidor
├── app.js              # Configuración de Express
└── package.json        # Dependencias y scripts
```

---

## 🔐 Autenticación y Autorización

### Sistema de Autenticación JWT

**Endpoint de Login:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Respuesta Exitosa:**

```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "email": "admin@example.com",
      "nombre": "Administrador",
      "rol": "admin"
    }
  }
}
```

### Uso del Token

Incluir el token en el header de todas las peticiones autenticadas:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles Disponibles:

- **admin** - Acceso completo al sistema
- **empleado** - Acceso limitado a funciones específicas
- **cliente** - Acceso solo a sus propios datos

---

## 🌐 Endpoints Principales

### 🔑 Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil del usuario

### 👥 Usuarios

- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### 🏢 Empresas

- `GET /api/empresas` - Listar empresas
- `POST /api/empresas` - Crear empresa
- `GET /api/empresas/:id` - Obtener empresa por ID
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa

### 👤 Clientes

- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/:id` - Obtener cliente por ID
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### 🛠️ Servicios

- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio
- `GET /api/servicios/:id` - Obtener servicio por ID
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### 📋 Solicitudes

- `GET /api/solicitudes` - Listar solicitudes
- `POST /api/solicitudes/crear/:servicio` - Crear solicitud por tipo de servicio
- `GET /api/solicitudes/:id` - Obtener solicitud por ID
- `PUT /api/solicitudes/:id` - Actualizar solicitud
- `DELETE /api/solicitudes/:id` - Eliminar solicitud

### 📅 Citas

- `GET /api/citas` - Listar citas
- `POST /api/citas` - Crear cita
- `GET /api/citas/:id` - Obtener cita por ID
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Eliminar cita

---

## 📝 Formularios Dinámicos

### Servicios Disponibles:

1. **Búsqueda de Antecedentes** - 7 campos obligatorios
2. **Certificación de Marca** - 19 campos obligatorios
3. **Renovación de Marca** - 16 campos obligatorios
4. **Cesión de Derechos** - 9 campos obligatorios
5. **Oposición** - 12 campos obligatorios
6. **Respuesta a Oposición** - 11 campos obligatorios
7. **Ampliación de Cobertura** - 12 campos obligatorios

### Endpoint de Formularios:

```http
POST /api/solicitudes/crear/{tipo-servicio}
```

**Tipos de servicio válidos:**

- `busqueda-antecedentes`
- `certificacion-marca`
- `renovacion-marca`
- `cesion-derechos`
- `oposicion`
- `respuesta-oposicion`
- `ampliacion-cobertura`

---

## 🧪 Ejemplos de Uso con Postman

### 1. Configurar Postman

1. **Crear nueva colección:** "API Registrack v4"
2. **Configurar variable de entorno:**
   - Variable: `base_url`
   - Valor: `http://localhost:3000/api`

### 2. Autenticación

**Request: Login**

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Guardar el token:**

- En la respuesta, copiar el valor de `data.token`
- En Postman, ir a la pestaña "Authorization"
- Seleccionar "Bearer Token"
- Pegar el token

### 3. Crear una Solicitud de Búsqueda de Antecedentes

**Request:**

```http
POST {{base_url}}/solicitudes/crear/busqueda-antecedentes
Authorization: Bearer {{token}}
Content-Type: application/json

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

### 4. Crear una Empresa

**Request:**

```http
POST {{base_url}}/empresas
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Empresa Legal S.A.S",
  "nit": "900123456-1",
  "direccion": "Calle 123 #45-67",
  "telefono": "6012345678",
  "email": "contacto@empresalegal.com",
  "ciudad": "Bogotá",
  "pais": "Colombia"
}
```

### 5. Crear un Cliente

**Request:**

```http
POST {{base_url}}/clientes
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "María González",
  "documento": "87654321",
  "tipo_documento": "Cédula de Ciudadanía",
  "telefono": "3008765432",
  "email": "maria@email.com",
  "direccion": "Calle 456 #78-90",
  "ciudad": "Medellín",
  "pais": "Colombia"
}
```

### 6. Listar Servicios

**Request:**

```http
GET {{base_url}}/servicios
Authorization: Bearer {{token}}
```

### 7. Crear una Cita

**Request:**

```http
POST {{base_url}}/citas
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "fecha": "2024-01-15",
  "hora": "10:00:00",
  "id_cliente": 1,
  "id_empleado": 1,
  "tipo_cita": "Consulta",
  "descripcion": "Consulta sobre registro de marca"
}
```

---

## 📊 Códigos de Respuesta

### Códigos de Éxito:

- **200** - OK (Operación exitosa)
- **201** - Created (Recurso creado exitosamente)

### Códigos de Error del Cliente:

- **400** - Bad Request (Datos inválidos)
- **401** - Unauthorized (No autenticado)
- **403** - Forbidden (Sin permisos)
- **404** - Not Found (Recurso no encontrado)
- **422** - Unprocessable Entity (Validación fallida)

### Códigos de Error del Servidor:

- **500** - Internal Server Error (Error interno)

### Formato de Respuesta de Error:

```json
{
  "success": false,
  "mensaje": "Descripción del error",
  "error": "Detalles técnicos del error"
}
```

---

## 🔧 Solución de Problemas

### Error de Conexión a Base de Datos

**Problema:** `Error de conexión: ECONNREFUSED`

**Solución:**

1. Verificar que MySQL esté ejecutándose
2. Revisar las credenciales en `.env`
3. Verificar que la base de datos exista

```bash
# Verificar estado de MySQL
sudo systemctl status mysql

# Conectar a MySQL
mysql -u root -p
```

### Error de Puerto en Uso

**Problema:** `EADDRINUSE: address already in use :::3000`

**Solución:**

```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000

# Terminar proceso (Windows)
taskkill /PID [PID_NUMBER] /F

# O cambiar puerto en .env
PORT=3001
```

### Error de Token Inválido

**Problema:** `401 Unauthorized`

**Solución:**

1. Verificar que el token esté en el header correcto
2. Asegurarse de que el token no haya expirado
3. Hacer login nuevamente para obtener un nuevo token

### Error de Validación de Formulario

**Problema:** `400 Bad Request` con campos faltantes

**Solución:**

1. Verificar que todos los campos obligatorios estén presentes
2. Revisar el tipo de servicio en la URL
3. Consultar la documentación de campos para cada servicio

---

## 📞 Soporte y Contacto

**Desarrollador:** [Tu Nombre]  
**Email:** [tu_email@ejemplo.com]  
**GitHub:** [tu_usuario_github]

### Recursos Adicionales:

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de JWT](https://jwt.io/)

---

## 🎯 Casos de Prueba Sugeridos

### Casos de Prueba Recomendados:

1. **Prueba de Autenticación:**

   - Login con credenciales válidas
   - Login con credenciales inválidas
   - Acceso a endpoint protegido sin token

2. **Prueba de CRUD Básico:**

   - Crear, leer, actualizar y eliminar empresa
   - Crear, leer, actualizar y eliminar cliente
   - Crear, leer, actualizar y eliminar servicio

3. **Prueba de Formularios Dinámicos:**

   - Crear solicitud de búsqueda de antecedentes
   - Crear solicitud de certificación de marca
   - Validar campos obligatorios faltantes

4. **Prueba de Sistema de Citas:**

   - Crear cita
   - Listar citas
   - Actualizar cita

5. **Prueba de Permisos:**
   - Acceso con rol admin
   - Acceso con rol empleado
   - Acceso con rol cliente

---

**¡La API está lista para ser probada! 🚀**

_Esta documentación cubre todos los aspectos necesarios para instalar, configurar y probar completamente la API desde cualquier computadora._
