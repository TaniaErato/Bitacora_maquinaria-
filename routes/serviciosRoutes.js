const express = require("express");
const router = express.Router();
const db = require("../bd");

const serviciosController = require("../controllers/serviciosController");

router.post("/servicios", serviciosController.crearServicio);

router.get("/servicios", serviciosController.obtenerServicios);

router.put("/servicios/reagendar/:id", serviciosController.reagendarServicio);

module.exports = router;

const crearTablas = require("../crearTablas");

router.get("/init-db", async (req, res) => {
  await crearTablas();
  res.send("Base de datos inicializada");
});