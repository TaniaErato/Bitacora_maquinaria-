const db = require("./config/db");
const crearTablas = async () => {
  try {
    // 1. Clientes
    await db.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id_cliente INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        telefono VARCHAR(20),
        empresa VARCHAR(100)
      ) ENGINE=InnoDB;
    `);

    // 2. Sucursales
    await db.query(`
      CREATE TABLE IF NOT EXISTS sucursales (
        id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        direccion VARCHAR(150)
      ) ENGINE=InnoDB;
    `);

    // 3. Servicios (con relaciones)
    await db.query(`
      CREATE TABLE IF NOT EXISTS servicios (
        id_servicio INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT NULL,
        id_sucursal INT NULL,
        trabajo_realizado TEXT,
        fecha DATETIME,
        estado VARCHAR(50),
        CONSTRAINT fk_cliente
          FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
          ON DELETE SET NULL,
        CONSTRAINT fk_sucursal
          FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
          ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    console.log("✅ Tablas creadas correctamente");
  } catch (error) {
    console.error("❌ Error creando tablas:", error);
  }
};

module.exports = crearTablas;