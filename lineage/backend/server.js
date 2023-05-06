require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { BACK_PORT, BACK_HOST } = process.env;

const app = express();

/*
 * ##########################################
 * ##   MIDDLEWARES DE CONEXIÓN Y ACCESO   ##
 * ##########################################
 */

//MIDDLEWARE - Logger morgan: muestra cualquier petición al servidor a través de nuestro terminal de node
app.use(morgan('dev'));

// Deserializa el body con formato JSON
app.use(express.json());

// Cross-Origin of Resource Sharing: Dependencia que facilita que un user-agent obtenga permiso para acceder a recursos seleccionados desde este servidor
// Middleware que permite conectar el backend (éste) con el frontend (React)
app.use(cors());

/*
 * ##########################
 * ##    RUTAS DE USERS    ##
 * ##########################
 */
const {
  loginUser,
  registerUser,
  validateUser,
  updateActivationSolicitude,
} = require('./controllers/users');


// Login de usuario
app.post('/users/login', loginUser);

// Registrar un nuevo usuario
app.post('/users/register', registerUser);

// Validar el código de registro
app.put('/users/register/validate/:registrationCode', validateUser);

// Solicitar la activación de cuenta
app.put("/users/login/solicitude", updateActivationSolicitude);

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

// SERVER LISTENING
app.listen(BACK_PORT, () => {
  console.log(`Server listening at http://${BACK_HOST}:${BACK_PORT}`);
});
