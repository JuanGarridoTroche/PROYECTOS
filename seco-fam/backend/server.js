"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cors = require("cors");

const {HOST, PORT, UPLOADS_DIR} = process.env;

// Crea el servidor 
const app = express();

// Acceso a la carpeta de "UPLOADS_DIR"
app.use(express.static(UPLOADS_DIR));

// Monitorización de datos en tiempo real
app.use(morgan("dev"));

// Deserializa el body con formato JSON
app.use(express.json());

// Deserializa el body con formato form-data
app.use(fileupload());

// Cross-Origin of Resource Sharing: Dependencia que facilita que un user-agent obtenga permiso para acceder a recursos seleccionados desde este servidor
// Middleware que permite conectar el backend (éste) con el frontend (React)
app.use(cors());


/*
 * ##########################################
 * ## RUTAS PARA  ##
 * ##########################################
 */
app.get("/", (req, res)=> {
    res.send({
        status: "Ok",
        message: "Acceso a la ruta raíz..."
    })
})



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

// Servidor escuchando en el puerto "PORT"
app.listen(PORT, ()=> {
    console.log(`Server listening at ${HOST}:${PORT}`);
})