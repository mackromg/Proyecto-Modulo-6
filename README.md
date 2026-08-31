# Proyecto Módulo 6 - Backend con Node.js y Express

Aplicación web desarrollada como parte del proyecto integrador, cumpliendo con la estructuración del servidor, gestión de rutas, contenido estático y persistencia básica en archivos planos.

## Requisitos del Sistema
- Node.js (versión 18 o superior)
- npm (Gestor de paquetes de Node)

## Instrucciones de Instalación
1. Clona este repositorio o descarga los archivos.
2. Abre la terminal en la carpeta del proyecto.
3. Instala las dependencias ejecutando `npm install`.

## Ejecución del Proyecto
- **Modo desarrollo (con Nodemon):** `npm run dev`
- **Modo producción (con Node):** `npm start`

## Rutas Disponibles
- `GET /` : Muestra la página web principal (estática desde `/public`).
- `GET /status` : Devuelve un objeto JSON con el estado del servidor.

## Decisiones Técnicas
- Se eligió nombrar `index.js` al archivo principal por estándar del ecosistema Node.js.
- Se implementó un middleware con el módulo nativo `fs` para registrar automáticamente cada visita de los usuarios en un archivo `log.txt` ubicado en la carpeta `/logs`.