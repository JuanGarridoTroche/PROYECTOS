const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

const { PORT, HOST } = process.env;

// Creamos el servidor express a través de su método
const app = express();

// Middleware para mostrar cualquier petición al servidor en nuestro terminal
app.use(morgan('dev'));

// Middleware para realizar la conexión entre nuestro back y front
app.use(cors());


//Levantamos el servidor en el puerto
app.listen(PORT, () => {
  console.log(`Server listening at ${HOST}:${PORT}`);
});
