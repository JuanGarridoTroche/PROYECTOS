'use strict';

const getConnection = require('../../getConnection');


const selectPhotoNewsByIdQuery = async (idNews) => {
  let connection;
  try {
    connection = await getConnection();
    const [news] = await connection.query(
      `SELECT id, name FROM photoNews WHERE idNews = ?`,
      [idNews]
    )

    return news[0];
  } finally {
    if(connection) connection.release();
  }
}

module.exports = selectPhotoNewsByIdQuery;