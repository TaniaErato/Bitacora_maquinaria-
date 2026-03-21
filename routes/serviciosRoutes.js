const express = require("express");
const router = express.Router();
const pool = require("../config/db");




router.get("/servicios", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id_servicio,
        c.nombre AS cliente,
        c.empresa,
        su.nombre AS sucursal,
        s.trabajo_realizado,
        s.fecha,
        s.estado
      FROM servicios s
      LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
      LEFT JOIN sucursales su ON s.id_sucursal = su.id_sucursal
      ORDER BY s.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo servicios" });
  }
});

router.post("/servicios", async (req, res) => {
  try {
    const { id_cliente, id_sucursal, trabajo_realizado, estado } = req.body;

    const [result] = await pool.query(
      `INSERT INTO servicios 
      (id_cliente, id_sucursal, trabajo_realizado, fecha, estado)
      VALUES (?, ?, ?, NOW(), ?)`,
      [id_cliente, id_sucursal, trabajo_realizado, estado]
    );

    res.json({ message: "Servicio creado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando servicio" });
  }
});

router.get("/clientes", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM clientes");
  res.json(rows);
});

router.post("/clientes", async (req, res) => {
  const { nombre, telefono, empresa } = req.body;

  const [result] = await pool.query(
    "INSERT INTO clientes (nombre, telefono, empresa) VALUES (?, ?, ?)",
    [nombre, telefono, empresa]
  );

  res.json({ id: result.insertId });
});

router.get("/sucursales", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM sucursales");
  res.json(rows);
});

router.post("/sucursales", async (req, res) => {
  const { nombre, direccion } = req.body;

  const [result] = await pool.query(
    "INSERT INTO sucursales (nombre, direccion) VALUES (?, ?)",
    [nombre, direccion]
  );

  res.json({ id: result.insertId });
});

router.put('/clientes/:id', async (req, res) => {
  try {
    const { nombre, telefono, empresa } = req.body;
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE clientes SET nombre=?, telefono=?, empresa=? WHERE id_cliente=?',
      [nombre, telefono, empresa, id]
    );

    res.json({ message: 'Cliente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM clientes WHERE id_cliente=?', [id]);

    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (!nombre || !telefono) {
  return res.status(400).json({ error: 'Datos incompletos' });
}

module.exports = router;