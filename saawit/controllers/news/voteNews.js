"use strict";

const selectNewsByIdQuery = require("../../bbdd/queries/news/selectNewsByIdQuery");
const insertVoteQuery = require("../../bbdd/queries/news/insertVoteQuery");
const selectTotalVotesQuery = require("../../bbdd/queries/news/selectTotalVotesQuery");
const updateFeedbackQuery = require("../../bbdd/queries/news/updateFeedbackQuery");
const { generateError } = require("../../helpers");

const voteNews = async (req, res, next) => {
  try {
    const { idNews } = req.params;

    const { like } = req.body;

    //Obtenemos la noticia
    const news = await selectNewsByIdQuery(idNews);

    // Si somos los dueños de la noticia no la podemos votar
    if (news.idUser === req.user.id) {
      throw generateError("No puedes votar tus propias noticias", 403);
    }

    // Comprobamos si es un voto true o false
    let value;
    if (like) {
      value = true;
    } else {
      value = false;
    }

    // Insertamos el voto
    await insertVoteQuery(value, req.user.id, idNews);

    // Hacemos el cálculo de los votos a favor - votos en contra para obtener el resultado
    const feedback = await selectTotalVotesQuery(idNews);

    // Actualizamos la tabla news, la columna feedback
    await updateFeedbackQuery(idNews, feedback);

    res.send({
      status: "Ok",
      message: "Voto enviado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = voteNews;
