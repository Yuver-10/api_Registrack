# 🗄️ Guía Completa de Base de Datos - API Registrack v4

## 📋 Información General

Esta guía te ayudará a configurar completamente la base de datos MySQL para la API Registrack v4, incluyendo la creación de datos de ejemplo para pruebas.

---

## 🔧 Configuración Inicial

### Paso 1: Instalar MySQL

**Windows:**

1. Descargar MySQL Installer desde: https://dev.mysql.com/downloads/installer/
2. Ejecutar el instalador
3. Seleccionar "MySQL Server" y "MySQL Workbench"
4. Configurar contraseña para el usuario `root`

**macOS:**

```bash
# Con Homebrew
brew install mysql
brew services start mysql

# Configurar contraseña
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Paso 2: Crear Base de Datos

```sql
-- Conectar a MySQL como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE registrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico para la aplicación (opcional pero recomendado)
CREATE USER 'registrack_user'@'localhost' IDENTIFIED BY 'registrack_password';
GRANT ALL PRIVILEGES ON registrack_db.* TO 'registrack_user'@'localhost';
FLUSH PRIVILEGES;

-- Salir de MySQL
EXIT;
```

### Paso 3: Configurar Variables de Entorno

Actualizar el archivo `.env`:

```env
# Para usar el usuario root
DB_NAME=registrack_db
DB_USER=root
DB_PASS=tu_contraseña_root

# O para usar el usuario específico
DB_NAME=registrack_db
DB_USER=registrack_user
DB_PASS=registrack_password

DB_HOST=localhost
DB_PORT=3306
```

---

## 🚀 Sincronización de Modelos

### Opción 1: Sincronización Automática (Recomendada)

```bash
# Desde la raíz del proyecto
npm run sync-db
```

Este comando:

- Crea todas las tablas automáticamente
- Establece las relaciones entre tablas
- Configura índices y restricciones

### Opción 2: Sincronización Manual

Si prefieres crear las tablas manualmente, ejecuta el archivo SQL incluido:

```bash
mysql -u root -p registrack_db < database-schema.sql
```

---

## 📊 Datos de Ejemplo

### Paso 1: Crear Roles Iniciales

```bash
npm run seed-roles
```

Esto crea los roles básicos:

- **admin** - Administrador del sistema
- **empleado** - Empleado de la empresa
- **cliente** - Cliente externo

### Paso 2: Crear Usuario Administrador

```bash
npm run create-admin
```

Esto crea un usuario administrador con:

- Email: `admin@registrack.com`
- Contraseña: `admin123`
- Rol: `admin`

### Paso 3: Insertar Datos de Ejemplo

```bash
# Ejecutar el script de datos de ejemplo
mysql -u root -p registrack_db < datos-ejemplo.sql
```

---

## 📋 Estructura de Tablas

### Tablas Principales:

1. **usuarios** - Usuarios del sistema
2. **roles** - Roles y permisos
3. **user_rol** - Relación usuario-rol
4. **empresas** - Información de empresas
5. **clientes** - Datos de clientes
6. **empleados** - Empleados de la empresa
7. **servicios** - Catálogo de servicios
8. **ordenes_de_servicios** - Solicitudes de servicios
9. **citas** - Sistema de citas
10. **seguimiento** - Seguimiento de solicitudes
11. **solicitudes_citas** - Solicitudes de citas
12. **pagos** - Información de pagos

### Relaciones Principales:

- `usuarios` → `user_rol` → `roles`
- `empresas` → `empleados`
- `clientes` → `ordenes_de_servicios`
- `servicios` → `ordenes_de_servicios`
- `ordenes_de_servicios` → `seguimiento`
- `clientes` → `citas`
- `empleados` → `citas`

---

## 🧪 Datos de Prueba Incluidos

### Usuarios de Prueba:

1. **Administrador:**

   - Email: `admin@registrack.com`
   - Contraseña: `admin123`
   - Rol: `admin`

2. **Empleado:**

   - Email: `empleado@registrack.com`
   - Contraseña: `empleado123`
   - Rol: `empleado`

3. **Cliente:**
   - Email: `cliente@ejemplo.com`
   - Contraseña: `cliente123`
   - Rol: `cliente`

### Empresas de Ejemplo:

1. **Registrack Legal S.A.S**

   - NIT: 900123456-1
   - Especializada en propiedad intelectual

2. **Consultoría Jurídica Ltda**
   - NIT: 900789012-3
   - Servicios legales generales

### Clientes de Ejemplo:

1. **Juan Pérez**

   - Documento: 12345678
   - Email: juan.perez@email.com

2. **María González**

   - Documento: 87654321
   - Email: maria.gonzalez@email.com

3. **Empresa ABC S.A.S**
   - NIT: 800123456-1
   - Email: contacto@empresaabc.com

### Servicios de Ejemplo:

1. **Búsqueda de Antecedentes** - $50,000
2. **Certificación de Marca** - $150,000
3. **Renovación de Marca** - $100,000
4. **Cesión de Derechos** - $80,000
5. **Oposición** - $120,000
6. **Respuesta a Oposición** - $100,000
7. **Ampliación de Cobertura** - $90,000

---

## 🔍 Verificación de la Instalación

### Verificar Conexión:

```bash
# Probar conexión desde Node.js
node -e "
import sequelize from './src/config/db.js';
try {
  await sequelize.authenticate();
  console.log('✅ Conexión exitosa');
} catch (error) {
  console.log('❌ Error de conexión:', error.message);
}
"
```

### Verificar Tablas:

```sql
-- Conectar a la base de datos
mysql -u root -p registrack_db

-- Listar todas las tablas
SHOW TABLES;

-- Verificar estructura de una tabla
DESCRIBE usuarios;

-- Verificar datos
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM empresas;
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM servicios;
```

### Verificar Datos de Ejemplo:

```sql
-- Ver usuarios creados
SELECT u.email, r.nombre as rol FROM usuarios u
JOIN user_rol ur ON u.id = ur.id_usuario
JOIN roles r ON ur.id_rol = r.id;

-- Ver empresas
SELECT nombre, nit FROM empresas;

-- Ver clientes
SELECT nombre, documento, email FROM clientes;

-- Ver servicios
SELECT nombre, precio_base FROM servicios;
```

---

## 🛠️ Comandos Útiles

### Backup de Base de Datos:

```bash
# Crear backup
mysqldump -u root -p registrack_db > backup_registrack_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u root -p registrack_db < backup_registrack_20240115.sql
```

### Limpiar Base de Datos:

```sql
-- Eliminar todos los datos (mantener estructura)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE seguimiento;
TRUNCATE TABLE citas;
TRUNCATE TABLE ordenes_de_servicios;
TRUNCATE TABLE solicitudes_citas;
TRUNCATE TABLE pagos;
TRUNCATE TABLE user_rol;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE clientes;
TRUNCATE TABLE empleados;
TRUNCATE TABLE empresas;
TRUNCATE TABLE servicios;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;
```

### Reiniciar Base de Datos:

```bash
# Eliminar y recrear base de datos
mysql -u root -p -e "DROP DATABASE IF EXISTS registrack_db; CREATE DATABASE registrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Sincronizar modelos
npm run sync-db

# Insertar datos iniciales
npm run seed-roles
npm run create-admin
mysql -u root -p registrack_db < datos-ejemplo.sql
```

---

## ⚠️ Solución de Problemas

### Error: "Table doesn't exist"

**Causa:** Las tablas no se han creado correctamente.

**Solución:**

```bash
npm run sync-db
```

### Error: "Access denied for user"

**Causa:** Credenciales incorrectas en `.env`.

**Solución:**

1. Verificar usuario y contraseña en `.env`
2. Probar conexión manual:

```bash
mysql -u [usuario] -p[contraseña] registrack_db
```

### Error: "Database doesn't exist"

**Causa:** La base de datos no existe.

**Solución:**

```sql
CREATE DATABASE registrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Foreign key constraint fails"

**Causa:** Datos inconsistentes o tablas no creadas en orden correcto.

**Solución:**

```bash
# Limpiar y recrear
npm run sync-db
npm run seed-roles
npm run create-admin
```

---

## 📞 Soporte

Si encuentras problemas con la configuración de la base de datos:

1. **Verificar logs del servidor** para errores específicos
2. **Revisar la configuración** en `.env`
3. **Probar conexión manual** a MySQL
4. **Consultar la documentación** de MySQL

**Comandos de diagnóstico:**

```bash
# Ver estado de MySQL
sudo systemctl status mysql

# Ver logs de MySQL
sudo tail -f /var/log/mysql/error.log

# Probar conexión
mysql -u root -p -e "SELECT VERSION();"
```

---

**¡La base de datos está lista para usar! 🎉**

_Con esta configuración, tendrás una base de datos completamente funcional con datos de ejemplo para probar todas las funcionalidades de la API._
