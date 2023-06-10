'use strict';

const selectTopTenRankedNewsQuery =require('../../bbdd/queries/news/selectTopTenRankedNewsQuery');

const NewsOrderedByFeedback = async (req, res, next) => {
  try {
      const byFeedback = await selectTopTenRankedNewsQuery();

      res.send({
      status: "Ok",
      message: "Listado de las noticias más valoradas",
      data: {
        byFeedback,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = NewsOrderedByFeedback;