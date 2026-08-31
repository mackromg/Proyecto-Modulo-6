# Proyecto Web Backend - Node.js, Express & PostgreSQL (Módulo 7)

Aplicación web backend desarrollada como parte del proyecto integrador, evolucionando la estructura previa hacia una arquitectura modular con persistencia en base de datos relacional, modelado de entidades mediante ORM y transaccionalidad segura


## Requisitos del Sistema
- Node.js (versión 18 o superior)
- PostgreSQL (versión 14 o superior)
- npm (Gestor de paquetes)


## Instalación y Configuración

1. Clonar el repositorio e ingresar a la carpeta del proyecto.
2. Instalar dependencias necesarias:
   npm install[cite: 1]
3. Configurar variables de entorno: Crear un archivo .env en la raíz del proyecto con la siguiente estructura
   PORT=3000
   DATABASE_URL=postgres://usuario:1234@localhost:5432/abp_modulo7
4. Crear la base de datos abp_modulo7 en PostgreSQL antes de iniciar el servidor.


## Ejecución del Proyecto
- Modo Desarrollo: npm run dev
- Modo Producción: npm start


## Endpoints y Rutas Disponibles

| GET | / | Vista HTML principal servida de forma estática
| GET | /status | Estado del servidor en formato JSON
| GET | /usuarios | Obtiene la lista de usuarios con sus pedidos anidados (include)
| POST | /usuarios/transaccion | Crea un usuario y su pedido en una transacción atómica con soporte de Rollback
| PUT | /usuarios/:id | Modifica los datos de un usuario existente
| DELETE | /usuarios/:id | Elimina un usuario y sus pedidos asociados en cascada

## Justificaciones y Decisiones Técnicas

- Elección de Cliente de Conexión y ORM: Se utilizó Sequelize sobre el motor PostgreSQL. Permite manipular tablas relacionales mediante objetos JavaScript, ofrece abstracción de alto nivel para definir modelos y relaciones, y aplica consultas parametrizadas que protegen de forma nativa contra inyecciones SQL en comparación con el cliente pg tradicional.
- Protección de Datos Sensibles: Las credenciales de acceso a la base de datos (DATABASE_URL, PORT) están aisladas en variables de entorno con dotenv para no exponer información confidencial en el repositorio. Asimismo, en las consultas de lectura (GET /usuarios) se filtran los atributos devueltos para evitar la exposición de metadata o información interna sensible.
- Validaciones y Control en Modificaciones: En las operaciones PUT y DELETE se valida explícitamente si el identificador solicitado existe en la base de datos. Si el registro no se encuentra, el servidor responde con un código 404 Not Found en lugar de confirmar una acción fallida.
- Consistencia y Transaccionalidad: La ruta POST /usuarios/transaccion utiliza transacciones gestionadas (sequelize.transaction()) para encadenar la creación simultánea del usuario y de su pedido. En caso de que ocurra algún error durante el proceso, el bloque catch ejecuta automáticamente un await t.rollback(), asegurando la integridad de los datos y evitando registros incompletos o huérfanos.
- Manejo de Relaciones: Se configuró una cardinalidad 1:N donde un Usuario posee múltiples Pedidos mediante la clave foránea usuarioId Se incluyó la cláusula onDelete: 'CASCADE' para eliminar automáticamente los pedidos asociados al suprimir un usuario, y se utilizó include para consultar la relación anidada en una única petición.
- Persistencia en Archivos Planos: Se mantuvo el middleware con el módulo nativo fs para registrar de manera persistente las visitas y rutas accedidas dentro del archivo logs/log.txt