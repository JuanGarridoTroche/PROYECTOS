"use strict";
require("dotenv").config();
const express = require("express");
const isAuth = require("./middlewares/isAuth");
const isImg = require("./middlewares/isImg");
const newsExists = require("./middlewares/newsExists");
const fileupload = require("express-fileupload");
const cors = require("cors");

const { PORT, UPLOADS_DIR } = process.env;
const app = express();

app.use(express.static(UPLOADS_DIR));

// Deserializa el body con formato JSON
app.use(express.json());

// Deserializa el body con formato form-data
app.use(fileupload());

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
  newUser,
  editPhoto,
  editPassword,
  sendRecoverPassword,
  recoverPassword,
  editProfile,
  readProfile,
  readLoggedProfile,
  getNews,
  deactivateAccount,
} = require("./controllers/users");

// Login de usuario
app.post("/users/login", loginUser);

// Nuevo usuario
app.post("/users", newUser);

//Editar mi Foto del usuario (ELIMINAR)
app.put("/users/photo", isAuth, editPhoto);

//Editar datos de usuario
app.put("/users/profile", isAuth, editProfile);

// Ver perfil de usuario
app.get("/users/profile/:idUser", readProfile);

// Ver el perfil del usuario loggeado
app.get("/users", isAuth, readLoggedProfile);

//Editar password del usuario
app.put("/users/password", isAuth, editPassword);

// Envío de Código de recuperación de contraseña a través de email
app.put("/users/password/solicitude", sendRecoverPassword);

// Recuperación de contraseña
app.put("/users/password/recover", recoverPassword);

// Ver todas las noticias de un usuario
app.get("/users/news", isAuth, getNews);

//Desactivar cuenta
app.put("/users/login", deactivateAccount)

/*
 * ##########################
 * ## Middleware de /news  ##
 * ##########################
 */
const {
  createNews,
  editNews,
  deleteNews,
  voteNews,
  NewsOrderedByFeedback,
  newsByCategory,
  readNews,
  listNews,
  newsShowImages,
  searchingNews,
  checkVotedNews,
} = require("./controllers/news");
const selectWordInBodyQuery = require("./bbdd/queries/news/selectCharactersInBodyQuery");

// Ver todas las noticias ordenadas por fecha: de la más actual a la más antigua.
app.get("/news", listNews);

// Crear una noticia
app.post("/news", isAuth, createNews);

// Lista de las últimas noticias del día ordenadas por valoración
app.get("/news/ByFeedback", NewsOrderedByFeedback);

//Lista de noticias según la categoría
app.get("/news/categoria/:category", newsByCategory);

// Leer una noticia
app.get("/news/:idNews", readNews);

// Editar una noticia ya creada
app.put("/news/:idNews", isAuth, editNews);

// Eliminar una noticia
app.delete("/news/:idNews", isAuth, newsExists, deleteNews);

// Buscar noticias con las letras/palabras indicadas
app.get("/news/search/:characters", searchingNews);

// Comprobar tus votos de cada noticia
app.get("/votes", isAuth, checkVotedNews)

// Vota una noticia publicada (de otro usuario registrado)
app.post("/news/:idNews/votes", isAuth, newsExists, voteNews);

// Ver imágenes de una noticia
app.get("/uploads/:name", newsShowImages);

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
