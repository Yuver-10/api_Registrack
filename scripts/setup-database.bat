@echo off
REM =============================================
REM Script de Configuración de Base de Datos
REM API Registrack v4 - Windows
REM =============================================

echo 🚀 Configurando base de datos para API Registrack v4...

REM Verificar si MySQL está instalado
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL no está instalado. Por favor instala MySQL primero.
    pause
    exit /b 1
)

echo ✅ MySQL encontrado

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm primero.
    pause
    exit /b 1
)

echo ✅ npm encontrado

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo ❌ Archivo .env no encontrado. Por favor crea el archivo .env con la configuración de la base de datos.
    pause
    exit /b 1
)

echo ✅ Archivo .env encontrado

REM Leer configuración de base de datos desde .env
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="DB_NAME" set DB_NAME=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASS" set DB_PASS=%%b
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_PORT" set DB_PORT=%%b
)

REM Verificar variables de entorno
if "%DB_NAME%"=="" (
    echo ❌ Variable DB_NAME no configurada en .env
    pause
    exit /b 1
)
if "%DB_USER%"=="" (
    echo ❌ Variable DB_USER no configurada en .env
    pause
    exit /b 1
)
if "%DB_PASS%"=="" (
    echo ❌ Variable DB_PASS no configurada en .env
    pause
    exit /b 1
)
if "%DB_HOST%"=="" (
    echo ❌ Variable DB_HOST no configurada en .env
    pause
    exit /b 1
)
if "%DB_PORT%"=="" (
    echo ❌ Variable DB_PORT no configurada en .env
    pause
    exit /b 1
)

echo ✅ Variables de entorno configuradas

REM Probar conexión a MySQL
echo ⚠️  Probando conexión a MySQL...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ No se puede conectar a MySQL. Verifica las credenciales en .env
    pause
    exit /b 1
)

echo ✅ Conexión a MySQL exitosa

REM Crear base de datos si no existe
echo ⚠️  Creando base de datos si no existe...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error al crear la base de datos
    pause
    exit /b 1
)

echo ✅ Base de datos '%DB_NAME%' creada/verificada

REM Instalar dependencias de Node.js
echo ⚠️  Instalando dependencias de Node.js...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas

REM Sincronizar modelos con la base de datos
echo ⚠️  Sincronizando modelos con la base de datos...
npm run sync-db
if %errorlevel% neq 0 (
    echo ❌ Error al sincronizar modelos
    pause
    exit /b 1
)

echo ✅ Modelos sincronizados

REM Crear roles iniciales
echo ⚠️  Creando roles iniciales...
npm run seed-roles
if %errorlevel% neq 0 (
    echo ❌ Error al crear roles
    pause
    exit /b 1
)

echo ✅ Roles creados

REM Crear usuario administrador
echo ⚠️  Creando usuario administrador...
npm run create-admin
if %errorlevel% neq 0 (
    echo ❌ Error al crear usuario administrador
    pause
    exit /b 1
)

echo ✅ Usuario administrador creado

REM Insertar datos de ejemplo
echo ⚠️  Insertando datos de ejemplo...
if exist "database\seed-data.sql" (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < database\seed-data.sql
    if %errorlevel% neq 0 (
        echo ❌ Error al insertar datos de ejemplo
        pause
        exit /b 1
    )
    echo ✅ Datos de ejemplo insertados
) else (
    echo ⚠️  Archivo database\seed-data.sql no encontrado, saltando inserción de datos de ejemplo
)

REM Verificar instalación
echo ⚠️  Verificando instalación...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SELECT 'Roles' as tabla, COUNT(*) as registros FROM roles UNION ALL SELECT 'Usuarios', COUNT(*) FROM usuarios UNION ALL SELECT 'Empresas', COUNT(*) FROM empresas UNION ALL SELECT 'Clientes', COUNT(*) FROM clientes UNION ALL SELECT 'Servicios', COUNT(*) FROM servicios;"
if %errorlevel% neq 0 (
    echo ❌ Error en la verificación
    pause
    exit /b 1
)

echo ✅ Verificación completada

echo.
echo 🎉 ¡Configuración de base de datos completada exitosamente!
echo.
echo 📋 Información de acceso:
echo    - Email: admin@registrack.com
echo    - Contraseña: admin123
echo    - Base de datos: %DB_NAME%
echo    - Host: %DB_HOST%:%DB_PORT%
echo.
echo 🚀 Para iniciar el servidor:
echo    npm run dev
echo.
echo 📚 Para más información, consulta la documentación en DOCUMENTACION-PROFESOR.md

pause
