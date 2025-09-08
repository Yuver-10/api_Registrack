-- =============================================
-- API Registrack v4 - Estructura de Base de Datos
-- =============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS registrack_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE registrack_db;

-- =============================================
-- TABLA: roles
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: user_rol
-- =============================================
CREATE TABLE IF NOT EXISTS user_rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (id_usuario, id_rol)
);

-- =============================================
-- TABLA: empresas
-- =============================================
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    nit VARCHAR(50) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: empleados
-- =============================================
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    documento VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia',
    id_empresa INT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON DELETE SET NULL
);

-- =============================================
-- TABLA: clientes
-- =============================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    documento VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: servicios
-- =============================================
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: ordenes_de_servicios
-- =============================================
CREATE TABLE IF NOT EXISTS ordenes_de_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_servicio INT NOT NULL,
    id_empresa INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_estimado DECIMAL(10,2) DEFAULT 0.00,
    estado VARCHAR(50) DEFAULT 'pendiente',
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(20),
    estado_orden VARCHAR(50),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON DELETE SET NULL
);

-- =============================================
-- TABLA: citas
-- =============================================
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    id_cliente INT NOT NULL,
    id_empleado INT,
    tipo_cita VARCHAR(100),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'programada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id) ON DELETE SET NULL
);

-- =============================================
-- TABLA: seguimiento
-- =============================================
CREATE TABLE IF NOT EXISTS seguimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_orden_servicio INT NOT NULL,
    estado VARCHAR(100) NOT NULL,
    observaciones TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden_servicio) REFERENCES ordenes_de_servicios(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: solicitudes_citas
-- =============================================
CREATE TABLE IF NOT EXISTS solicitudes_citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_preferida DATE,
    hora_preferida TIME,
    tipo_consulta VARCHAR(100),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: pagos
-- =============================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_orden_servicio INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago TIMESTAMP NULL,
    referencia VARCHAR(255),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden_servicio) REFERENCES ordenes_de_servicios(id) ON DELETE CASCADE
);

-- =============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =============================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_clientes_documento ON clientes(documento);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_ordenes_cliente ON ordenes_de_servicios(id_cliente);
CREATE INDEX idx_ordenes_servicio ON ordenes_de_servicios(id_servicio);
CREATE INDEX idx_ordenes_fecha ON ordenes_de_servicios(fecha_creacion);
CREATE INDEX idx_citas_fecha ON citas(fecha);
CREATE INDEX idx_citas_cliente ON citas(id_cliente);
CREATE INDEX idx_seguimiento_orden ON seguimiento(id_orden_servicio);
