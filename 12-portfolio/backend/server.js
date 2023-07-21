const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileupload = require('express-fileupload');
const isAuth = require('./middlewares/isAuth');
require('dotenv').config();

const { PORT, HOST, UPLOADS_DIR } = process.env;

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
const {
  login,
  updateProfile,
  readProfile,
  updatePassword,
  sendPassCodeEmail,
  updatePasswordWithPassCode,
} = require('./controllers/users');

// Login de usuario
app.post('/user/login', login);

//Actualizar datos del usuario
app.put('/user/updateProfile', isAuth, updateProfile);

// Actualizar contraseña
app.patch('/user/password/:idUser', isAuth, updatePassword);

// Envío de código de recuperación de contraseña a través de email
app.put('/user/password/solicitude', sendPassCodeEmail);

// Recuperación de contraseña
app.put('/user/password/passcode', updatePasswordWithPassCode);

// Mostrar los datos del usuario
app.get('/user/profile/:idUser', readProfile);

/*
 * ##############################
 * ##    RUTAS DE PROYECTOS    ##
 * ##############################
 */
// Mostrar todos los proyectos

// Crear un proyecto

// Editar un proyecto

// Eliminar un proyecto

/*
 * ###############################
 * ##    RUTAS DE CURRICULUM    ##
 * ###########################1###
 */
// Mostrar todos los perfiles de curriculum

// Mostrar los datos necesarios del perfil del CV

// Crear un perfil de CV

/*
 * ##############################
 * ##    RUTAS DE CONTACTOS    ##
 * #########################1####
 */
// Mostrar todos los contactos

// Crear un contacto

// Actualizar un contacto

// Eliminar un contacto

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
