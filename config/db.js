const mysql = require("mysql2");

function crearTablas(){

const sqlClientes = `
CREATE TABLE IF NOT EXISTS clientes(
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
telefono VARCHAR(20),
empresa VARCHAR(100)
);
`;

const sqlSucursales = `
CREATE TABLE IF NOT EXISTS sucursales(
id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
direccion VARCHAR(150)
);
`;

const sqlServicios = `
CREATE TABLE IF NOT EXISTS servicios(
id_servicio INT AUTO_INCREMENT PRIMARY KEY,
id_cliente INT,
id_sucursal INT,
trabajo_realizado TEXT,
fecha DATETIME,
estado VARCHAR(50),
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);
`;

connection.query(sqlClientes);
connection.query(sqlSucursales);
connection.query(sqlServicios);

console.log("Tablas verificadas/creadas");
}

module.exports = connection;