require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const isAuth = require("./middlewares/isAuth");
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

// Permite tener acceso a la carpeta de assets de manera pública
app.use('/assets', express.static('./assets'));

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
  updateUserProfile,
  editPassword,
  sendRecoverPassword,
  recoverPassword,
  readLoggedUserProfile,
  readUserProfile,
  readUsersList,
} = require('./controllers/users');


// Login de usuario
app.post('/users/login', loginUser);

// Registrar un nuevo usuario
app.post('/users/register', registerUser);

// Validar el código de registro
app.put('/users/register/validate/:registrationCode', validateUser);

// Solicitar la activación de cuenta
app.put("/users/login/solicitude", updateActivationSolicitude);

// Actualizar datos del usuario
app.put("/users/editUser", isAuth, updateUserProfile);

// Actualizar contraseña de usuario estando logueado
app.put("/users/editPassword", isAuth, editPassword);

// Envío de Código de recuperación de contraseña a través de email
app.put("/users/password/solicitude", sendRecoverPassword);

// Recuperación de contraseña
app.put("/users/password/recover", recoverPassword);

// Mostrar los datos del usuario logueado
app.get("/users/loggedProfile", isAuth, readLoggedUserProfile);

// Sacar un listado de todos los usuarios registrados en la BBDD
app.get("/users/list", readUsersList);

// Mostrar los datos de un usuario como invitado
app.get("/users/:idUser", readUserProfile);


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
