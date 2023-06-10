'use strict';

const selectNewsByDateQuery = require('../../bbdd/queries/news/selectNewsByDateQuery')

const newsByDate = async (req, res, next) => {
  try {
      const {dateFrom, dateTo} = req.query;
      const news = await selectNewsByDateQuery(dateFrom, dateTo);

      res.send({
      status: "Ok",
      message: `Listado de las noticias desde el ${dateFrom} hasta el ${dateTo}`,
      data: {
        news,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newsByDate;