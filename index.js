const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const { Usuario, Pedido } = require('./models/Pedido');
const { crearUsuarioConPedido } = require('./services/transaccion');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- MIDDLEWARE LOGS ---
app.use((req, res, next) => {
    const fechaActual = new Date().toLocaleString();
    const logMensaje = `[${fechaActual}] - Ruta accedida: ${req.url}\n`;
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    const rutaLog = path.join(logsDir, 'log.txt');
    fs.appendFile(rutaLog, logMensaje, (err) => { if (err) console.error('Error log:', err); });
    next();
});

// --- RUTAS FRONTEND ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/status', (req, res) => {
    res.json({ estado: "OK", mensaje: "El servidor funciona correctamente", timestamp: new Date() });
});

// 1. GET - Obtener usuarios con sus pedidos
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email'], 
            include: [{ model: Pedido, attributes: ['id', 'producto', 'total'] }] 
        });
        res.json({ status: "success", data: usuarios });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// 2. POST - Transacción
app.post('/usuarios/transaccion', async (req, res) => {
    const { nombre, email, producto, total } = req.body;
    try {
        const resultado = await crearUsuarioConPedido(nombre, email, producto, total);
        res.status(201).json({ status: "success", message: "Transacción exitosa", data: resultado });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Falló la transacción (Rollback)", detalle: error.message });
    }
});

// 3. PUT - Actualizar usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Usuario.update(req.body, { where: { id } });
        if (updated) {
            res.json({ status: "success", message: "Usuario actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error en la actualización" });
    }
});

// 4. DELETE - Eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Usuario.destroy({ where: { id } });
        if (deleted) {
            res.json({ status: "success", message: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

// Sincronizar DB e Iniciar servidor
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a PostgreSQL establecida con éxito.');
        return sequelize.sync({ force: false }); 
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
    })
    .catch(err => console.error('No se pudo conectar a la BD:', err));