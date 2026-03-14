const express = require("express");
const router = express.Router();

const serviciosController = require("../controllers/serviciosController");

router.post("/servicios", serviciosController.crearServicio);

router.get("/servicios", serviciosController.obtenerServicios);

router.put("/servicios/reagendar/:id", serviciosController.reagendarServicio);

module.exports = router;