const express = require("express");
const router = express.Router();
const firestore = require('../config/firebase');
const pool = require("../config/db");

// ==========================================
// 🔹 PRUEBAS Y DIAGNÓSTICO
// ==========================================

router.get("/test-firestore", async (req, res) => {
    try {
        console.log("🔥 Probando Firestore...");
        await firestore.collection('bitacora').add({
            mensaje: "Prueba desde backend",
            fecha: new Date()
        });
        console.log("✅ FIRESTORE OK");
        res.send("Firestore funcionando");
    } catch (error) {
        console.error("❌ ERROR FIRESTORE:", error);
        res.status(500).send(error.message);
    }
});

// ==========================================
// 🔹 SERVICIOS (MySQL + Firestore)
// ==========================================

// Obtener todos los servicios con JOIN (Incluye id_cliente para el historial de Angular)
router.get("/servicios", async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT 
        s.id_servicio,
        s.id_cliente,  
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
        console.error("❌ ERROR AL OBTENER SERVICIOS:", error);
        res.status(500).json({ error: error.message });
    }
});

// Crear servicio y registrar en Bitácora (Híbrido)
router.post("/servicios", async (req, res) => {
    try {
        console.log("🔥 Datos recibidos en POST /servicios:", req.body);
        const { id_cliente, id_sucursal, trabajo_realizado, estado } = req.body;

        // Validación de campos obligatorios
        if (!id_cliente || !trabajo_realizado || !estado) {
            return res.status(400).json({ error: "Faltan campos obligatorios (id_cliente, trabajo, estado)" });
        }

        let nombreCliente = "Desconocido";
        let nombreSucursal = "No asignada";

        // Obtener nombre del cliente para Firestore
        const [cliente] = await pool.query("SELECT nombre FROM clientes WHERE id_cliente = ?", [id_cliente]);
        if (cliente.length > 0) nombreCliente = cliente[0].nombre;

        // Obtener nombre de la sucursal para Firestore
        if (id_sucursal) {
            const [sucursal] = await pool.query("SELECT nombre FROM sucursales WHERE id_sucursal = ?", [id_sucursal]);
            if (sucursal.length > 0) nombreSucursal = sucursal[0].nombre;
        }

        // 1. Guardar en MySQL
        const [result] = await pool.query(
            `INSERT INTO servicios (id_cliente, id_sucursal, trabajo_realizado, fecha, estado) VALUES (?, ?, ?, NOW(), ?)`,
            [id_cliente, id_sucursal || null, trabajo_realizado, estado]
        );

        const servicioId = result.insertId;

        // 2. Guardar en Firestore (Bitácora no relacional)
        try {
            await firestore.collection('bitacora').add({
                servicioId: Number(servicioId),
                mensaje: "Registro inicial de servicio",
                estado,
                trabajo_realizado,
                id_cliente: Number(id_cliente),
                cliente: nombreCliente,
                sucursal: nombreSucursal,
                fecha: new Date()
            });
            console.log("✅ Bitácora en Firestore creada");
        } catch (err) {
            console.error("⚠️ Error silencioso en Firestore:", err.message);
            // No detenemos la respuesta si falla Firestore, ya que MySQL ya guardó.
        }

        res.status(201).json({ message: "Servicio creado con éxito", id: servicioId });

    } catch (error) {
        console.error("❌ ERROR AL CREAR SERVICIO:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 🔹 BITÁCORA (Firestore)
// ==========================================

router.get("/bitacora/:servicioId", async (req, res) => {
    try {
        const { servicioId } = req.params;
        const snapshot = await firestore
            .collection('bitacora')
            .where('servicioId', '==', Number(servicioId))
            .get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 🔹 CLIENTES (CRUD MySQL)
// ==========================================

router.get("/clientes", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clientes ORDER BY nombre ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/clientes", async (req, res) => {
    try {
        const { nombre, telefono, empresa } = req.body;
        const [result] = await pool.query(
            "INSERT INTO clientes (nombre, telefono, empresa) VALUES (?, ?, ?)",
            [nombre, telefono, empresa]
        );
        res.status(201).json({ id: result.insertId, message: "Cliente creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/clientes/:id', async (req, res) => {
    try {
        const { nombre, telefono, empresa } = req.body;
        const { id } = req.params;
        await pool.query(
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

// ==========================================
// 🔹 SUCURSALES (MySQL)
// ==========================================

router.get("/sucursales", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM sucursales");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/sucursales", async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

        const [result] = await pool.query(
            "INSERT INTO sucursales (nombre, direccion) VALUES (?, ?)",
            [nombre, direccion || null]
        );
        res.status(201).json({ id: result.insertId, message: "Sucursal creada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;