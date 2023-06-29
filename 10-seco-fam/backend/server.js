"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cors = require("cors");
const isAuth = require("./middlewares/isAuth");

const {HOST, PORT, UPLOADS_DIR} = process.env;

// Crea el servidor 
const app = express();

// Acceso a la carpeta de "UPLOADS_DIR"
app.use('/static', express.static(UPLOADS_DIR));

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
 * #####################
 * ## RUTAS PARA USER ##
 * #####################
 */
const { showLineage, login, readLoggedProfile, getFamilyNames, sendForm, getFamilyDataByUrl } = require("./controllers/users");
const updateJSON = require("./controllers/users/updateJSON");


// Login de usuario
app.post("/", login);

app.get("/loggedProfile", isAuth, readLoggedProfile);

// Obtener el nombre de todas las familias
app.get("/familyNames", isAuth, getFamilyNames);

// Enviar formulario
app.post("/form/sendForm", isAuth, sendForm);

// Acceso a los pdf de la familia
app.get("/:url", isAuth, showLineage);

// Prueba de guardado de datos en JSON
// app.post("/new-entry", isAuth, updateJSON)

// Obtener los datos de la familia por la url
app.get("/data/:url", isAuth, getFamilyDataByUrl)



/*
 * #################################
 * ## RUTAS PARA ADMIN SOBRE PDFs ##
 * #################################
 */

const { createPDF, updatePDF, deletePDF, uploadPDF } = require("./controllers/pdfs");

// Crear fichero pdf de una de las familias por parte del admin
app.post("/createPDF/:url", isAuth, createPDF);


// Actualizar un fichero pdf por parte del administrador
app.put("/pdf", isAuth, updatePDF);


// Eliminar fichero pdf por parte del admin
app.delete("/pdf", isAuth, deletePDF)


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