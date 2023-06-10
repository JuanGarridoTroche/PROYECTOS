"use strict";

const SelectVotedNewsQuery = require("../../bbdd/queries/news/SelectvotedNewsQuery");
const { generateError } = require("../../helpers");

const checkVotedNews = async (req, res, next) => {
  try {   
   
    // Seleccionamos todas las noticias que hemos votado
    const votedNews = await SelectVotedNewsQuery(req.user.id);
    

    res.send({
      status: "Ok",
      data: votedNews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = checkVotedNews;
