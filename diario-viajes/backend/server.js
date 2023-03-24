require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");

const { PORT, UPLOADS_DIR } = process.env;

// Creamos un servidor express.
const app = express();

// Middleware que permite conectar el backend con el frontend (evita problemas
// con as CORS).
app.use(cors());

// Middleware que indica cuál es el directorio de ficheros estáticos.
app.use(express.static(UPLOADS_DIR));

// Middleware que deserializa un body en formato "raw" creando la propiedad
// "body" en el objeto "request".
app.use(express.json());

// Middleware que deserializa un body en formato "form-data" creando la propiedad
// "files" en el objeto "request".
app.use(fileUpload());

// Middleware que muestra información acerca de la petición.
app.use(morgan("dev"));

/**
 * ###############################
 * ## Controladores intermedios ##
 * ###############################
 */

const isAuth = require("./middlewares/isAuth");

/**
 * ##########################
 * ## Middlewares usuarios ##
 * ##########################
 */

const {
  newUser,
  loginUser,
  validateUser,
  getUser,
  editAvatar,
  sendRecoverPassword,
  editPassword,
} = require("./controllers/users");

// Registrar un nuevo usuario pendiente de validar.
app.post("/users", newUser);

// Login de usuario.
app.post("/users/login", loginUser);

// Validar un usuario.
app.put("/users/validate/:registrationCode", validateUser);

// Obtener info de un usuario.
app.get("/users/:idUser", isAuth, getUser);

// Editar avatar de usuario.
app.put("/users/avatar", isAuth, editAvatar);

// Enviar un email de recuperación de contraseña.
app.post("/users/password/recover", sendRecoverPassword);

// Editamos la contraseña de un usuario con un código de recuperación.
app.put("/users/password", editPassword);

/**
 * ##########################
 * ## Middlewares entradas ##
 * ##########################
 */

const {
  newEntry,
  listEntries,
  getEntry,
  voteEntry,
  addEntryPhoto,
  deleteEntryPhoto,
} = require("./controllers/entries");

// Crear una nueva entrada.
app.post("/entries", isAuth, newEntry);

// Listar entradas.
app.get("/entries", listEntries);

// Obtener una entrada concreta.
app.get("/entries/:idEntry", getEntry);

// Votar una entrada.
app.post("/entries/:idEntry/votes", isAuth, voteEntry);

// Agregar una foto a una entrada.
app.post("/entries/:idEntry/photos", isAuth, addEntryPhoto);

// Eliminar una foto de una entrada.
app.delete("/entries/:idEntry/photos/:idPhoto", isAuth, deleteEntryPhoto);

/**
 * #####################################
 * ## Middleware de error / not found ##
 * #####################################
 */

// Middleware de error.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
});

// Middleware de ruta no encontrada.
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Ruta no encontrada",
  });
});

// Ponemos el servidor a escuchar peticiones en un puerto.
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
