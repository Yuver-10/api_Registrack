#!/bin/bash

# =============================================
# Script de Configuración de Base de Datos
# API Registrack v4
# =============================================

echo "🚀 Configurando base de datos para API Registrack v4..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
    print_error "MySQL no está instalado. Por favor instala MySQL primero."
    exit 1
fi

print_message "MySQL encontrado"

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

print_message "Node.js encontrado"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instala npm primero."
    exit 1
fi

print_message "npm encontrado"

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    print_error "Archivo .env no encontrado. Por favor crea el archivo .env con la configuración de la base de datos."
    exit 1
fi

print_message "Archivo .env encontrado"

# Leer configuración de base de datos desde .env
source .env

# Verificar variables de entorno
if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
    print_error "Variables de entorno de base de datos no configuradas correctamente en .env"
    exit 1
fi

print_message "Variables de entorno configuradas"

# Probar conexión a MySQL
print_warning "Probando conexión a MySQL..."
if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &> /dev/null; then
    print_message "Conexión a MySQL exitosa"
else
    print_error "No se puede conectar a MySQL. Verifica las credenciales en .env"
    exit 1
fi

# Crear base de datos si no existe
print_warning "Creando base de datos si no existe..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
    print_message "Base de datos '$DB_NAME' creada/verificada"
else
    print_error "Error al crear la base de datos"
    exit 1
fi

# Instalar dependencias de Node.js
print_warning "Instalando dependencias de Node.js..."
npm install

if [ $? -eq 0 ]; then
    print_message "Dependencias instaladas"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# Sincronizar modelos con la base de datos
print_warning "Sincronizando modelos con la base de datos..."
npm run sync-db

if [ $? -eq 0 ]; then
    print_message "Modelos sincronizados"
else
    print_error "Error al sincronizar modelos"
    exit 1
fi

# Crear roles iniciales
print_warning "Creando roles iniciales..."
npm run seed-roles

if [ $? -eq 0 ]; then
    print_message "Roles creados"
else
    print_error "Error al crear roles"
    exit 1
fi

# Crear usuario administrador
print_warning "Creando usuario administrador..."
npm run create-admin

if [ $? -eq 0 ]; then
    print_message "Usuario administrador creado"
else
    print_error "Error al crear usuario administrador"
    exit 1
fi

# Insertar datos de ejemplo
print_warning "Insertando datos de ejemplo..."
if [ -f "database/seed-data.sql" ]; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/seed-data.sql
    
    if [ $? -eq 0 ]; then
        print_message "Datos de ejemplo insertados"
    else
        print_error "Error al insertar datos de ejemplo"
        exit 1
    fi
else
    print_warning "Archivo database/seed-data.sql no encontrado, saltando inserción de datos de ejemplo"
fi

# Verificar instalación
print_warning "Verificando instalación..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
SELECT 'Roles' as tabla, COUNT(*) as registros FROM roles
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Empresas', COUNT(*) FROM empresas
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Servicios', COUNT(*) FROM servicios;
"

if [ $? -eq 0 ]; then
    print_message "Verificación completada"
else
    print_error "Error en la verificación"
    exit 1
fi

echo ""
echo "🎉 ¡Configuración de base de datos completada exitosamente!"
echo ""
echo "📋 Información de acceso:"
echo "   - Email: admin@registrack.com"
echo "   - Contraseña: admin123"
echo "   - Base de datos: $DB_NAME"
echo "   - Host: $DB_HOST:$DB_PORT"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   npm run dev"
echo ""
echo "📚 Para más información, consulta la documentación en DOCUMENTACION-PROFESOR.md"
