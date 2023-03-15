require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { PORT } = process.env;
const app = express();
//Monitorizamos en tiempo real cualquier petición que hacemos al servidor a través de nuestro terminal
app.use(morgan("dev"));

// Deserializa el body con formato JSON
app.use(express.json());

// Cross-Origin of Resource Sharing: Dependencia que facilita que un user-agent obtenga permiso para acceder a recursos seleccionados desde este servidor
// Middleware que permite conectar el backend (éste) con el frontend (React)
app.use(cors());

/*
 * ###########################
 * ## Middleware de /users  ##
 * ###########################
 */

const {
  loginUser,
  registerUser,
  validateUser,
} = require("./controllers/users");

//Login de usuario
app.post("/user/login", loginUser);

// Registro de usuario
app.post("/user/register", registerUser);

// Validar un usuario.
app.put("/user/register/validate/:registrationCode", validateUser);

/*
 * ###############################
 * ##  Middleware de /accounts  ##
 * ###############################
 */

const isAuth = require("./middlewares/isAuth");
const { createAccount, updateAccount, deleteAccount } = require("./controllers/accounts");
// Crear una cuenta nueva
app.post("/account", isAuth, createAccount);

// Editar alias o nombre del banco
app.put("/account/:idAccount", isAuth, updateAccount);

// Eliminar una cuenta
app.delete("/account/:idAccount", isAuth, deleteAccount);


/*
 * ##############################
 * ##  Middleware de /entries  ##
 * ##############################
 */


// Crear un asiento nuevo

// Actualizar un asiento

// Eliminar un asiento



/*
 * ############################
 * ##  Middleware de /types  ##
 * ############################
 */

// Crear un tipo de asiento

// Actualizar un tipo de asiento

// Eliminar un tipo de asiento



/*
 * ##########################################
 * ## Middleware de Error y 404 NOT FOUND  ##
 * ##########################################
 */

// Middleware de Error:
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
});

// Middleware 404 NOT FOUND
app.use((req, res) => {
  res.status(404).send({
    status: "Error",
    message: "Ruta no encontrada 😿",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
