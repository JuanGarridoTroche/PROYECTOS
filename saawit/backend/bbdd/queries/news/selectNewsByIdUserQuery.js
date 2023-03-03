'use strict';

const { generateError } = require('../../../helpers');
const getConnection = require('../../getConnection');


const selectNewsByIdUserQuery = async (idUser) => {
  let connection;
  try {
    connection = await getConnection();
    const [news] = await connection.query(
      `SELECT id, category, feedback,  title, summary, body, createdAt FROM news WHERE idUser = ?`,
      [idUser]
    )
    if(!news[0]) {
      throw generateError('El usuario no tiene noticias creadas', 400)
    }
    
    return news;
  } finally {
    if(connection) connection.release();
  }
}

module.exports = selectNewsByIdUserQuery;