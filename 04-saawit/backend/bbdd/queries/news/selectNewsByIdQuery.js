'use strict';

const { generateError } = require('../../../helpers');
const getConnection = require('../../getConnection');


const selectNewsByIdQuery = async (idNews) => {
  let connection;
  try {
    connection = await getConnection();
    const [news] = await connection.query(
      `SELECT id, category, idUser, title, summary, body, createdAt FROM news WHERE id = ?`,
      [idNews]
    )
    if(!news[0]) {
      throw generateError('El id de la noticia enviada, no existe', 400)
    }
    return news[0];
  } finally {
    if(connection) connection.release();
  }
}

module.exports = selectNewsByIdQuery;