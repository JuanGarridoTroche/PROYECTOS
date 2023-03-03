"use strict";

const selectNewsByIdUserQuery = require("../../bbdd/queries/news/selectNewsByIdUserQuery");

const getNews = async (req, res, next) => {
  try {
    const { id: idUser } = req.user;

    // Seleccionamos los datos actuales del usuario
    const news = await selectNewsByIdUserQuery(idUser);   

    res.send({
      status: "Ok",
      message: "perfil de usuario",
      data: news,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getNews;