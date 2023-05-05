const morgan = require("morgan");
const express = require("express");
require("dotenv").config();
const { BACK_PORT, BACK_HOST } = process.env;

const app = express();

//MIDDLEWARE - Logger morgan: muestra cualquier petición al servidor a través de nuestro terminal de node
app.use(morgan("dev"));

/*
 * ###########################
 * ## Middleware de /users  ##
 * ###########################
 */

app.get("/users");

/*
 * ##########################################
 * ## MIDDLEWARE DE ERROR Y 404 NOT FOUND  ##
 * ##########################################
 */

//Middleware de error:
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "Se ha producido un error: ",
    message: err.message,
  });
});

// Middleware de 404 not found
app.use((req, res) => {
  res.status(404).send({
    status: "Error",
    message: "Ruta no encontrada 🧟",
  })
})

// SERVER LISTENING
app.listen(BACK_PORT, () => {
  console.log(`Server listening at http://${BACK_HOST}:${BACK_PORT}`);
});
