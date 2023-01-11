"use strict";

const selectByCategoryQuery = require("../../bbdd/queries/news/selectByCategoryQuery");

const { generateError } = require("../../helpers");

const newsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    // Si category no corresponde a ninguna categoría válida, category = 'general'
    const listOfCategories = [
      "deportes",
      "videojuegos",
      "noticias",
      "programación",
      "viajes",
      "tecnología",
      "música",
      "memes",
      "general",
    ];
    if (!listOfCategories.find((e) => e === category)) {
      throw generateError(
        "La categoría no existe, por favor filtre por una de las siguientes categorías: deportes, videojuegos, noticias, programación, viajes, tecnología, música, memes, general"
      );
    }

    // Si la categoría es correcta, hacemos un listado de todas las noticias
    const byCategory = await selectByCategoryQuery(category);

    res.send({
      status: "Ok",
      message: `Listado de las noticias con la categoría ${category}:`,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newsByCategory;
