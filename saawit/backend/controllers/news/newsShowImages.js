"use strict";
const selectPhotoNewsByNameQuery = require("../../bbdd/queries/news/selectPhotoNewsByNameQuery");

const readNews = async (req, res, next) => {
  try {
    const { name } = req.params;

    // Seleccionamos las imágenes pertenecientes a la noticia (máximo 3) que hay que eliminar
    const photoNews = await selectPhotoNewsByNameQuery(name);

    // Mostramos los datos
    res.send({
      status: "Ok",
      data: photoNews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readNews;
