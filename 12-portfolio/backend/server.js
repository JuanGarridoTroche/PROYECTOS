const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

const { PORT, HOST } = process.env;

// Creamos el servidor express a través de su método
const app = express();


/*
 * ##########################################
 * ##   MIDDLEWARES DE CONEXIÓN Y ACCESO   ##
 * ##########################################
 */

// Middleware para mostrar cualquier petición al servidor en nuestro terminal
app.use(morgan('dev'));

// Deserializa el body con formato JSON
app.use(express.json());

// Deserializa el body con form-data (archivos)
app.use(fileupload());

// Middleware para realizar la conexión entre nuestro back y front
app.use(cors());

// Permite tener acceso a la carpeta de assets de manera pública
app.use('/files', express.static(UPLOADS_DIR));


/*
 * ##########################
 * ##    RUTAS DE USERS    ##
 * ##########################
 */





/*
 * ##########################################
 * ## MIDDLEWARE DE ERROR Y 404 NOT FOUND  ##
 * ##########################################
 */

//Middleware de error:
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: 'error',
    message: err.message,
  });
});

// Middleware de 404 not found
app.use((req, res) => {
  res.status(404).send({
    status: 'Error',
    message: 'Ruta no encontrada 🧟',
  });
});

//Levantamos el servidor en el puerto
app.listen(PORT, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
