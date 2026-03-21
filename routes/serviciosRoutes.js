const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET maquinaria
router.get("/maquinaria", (req, res) => {
  pool.query("SELECT * FROM maquinaria", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en la consulta" });
    }
    res.json(results);
  });
});

// POST maquinaria
router.post("/maquinaria", (req, res) => {
  const { nombre, descripcion } = req.body;

  const sql = "INSERT INTO maquinaria (nombre, descripcion) VALUES (?, ?)";

  pool.query(sql, [nombre, descripcion], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al insertar" });
    }
    res.json({ message: "Registro creado", id: result.insertId });
  });
});

module.exports = router;