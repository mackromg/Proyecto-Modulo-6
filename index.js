const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para registrar accesos en logs/log.txt (Persistencia en archivos planos)
app.use((req, res, next) => {
    const fechaActual = new Date().toLocaleString();
    const logMensaje = `[${fechaActual}] - Ruta accedida: ${req.url}\n`;
    
    // Crea la carpeta logs y añade el registro sin borrar los anteriores
    const rutaLog = path.join(__dirname, 'logs', 'log.txt');
    fs.appendFile(rutaLog, logMensaje, (err) => {
        if (err) console.error('Error al registrar el log:', err);
    });
    
    next();
});

// 1. Servir contenido estático desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 2. Ruta principal (Devuelve HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. Ruta /status (Devuelve formato JSON)
app.get('/status', (req, res) => {
    res.json({
        estado: "OK",
        mensaje: "El servidor funciona correctamente",
        timestamp: new Date()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});