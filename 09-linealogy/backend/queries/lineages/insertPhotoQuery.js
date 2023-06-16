'use strict';

const getConnection = require('../../BBDD/getConnection');


const insertPhotoQuery = async (photo, idNews) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `INSERT INTO PhotoNews (name, idNews, createdAt) VALUES (?, ?, ?)`,
      [photo, idNews, new Date()]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = insertPhotoQuery;