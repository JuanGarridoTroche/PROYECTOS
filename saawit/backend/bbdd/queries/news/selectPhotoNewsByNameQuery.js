'use strict';

const getConnection = require('../../getConnection');


const selectPhotoNewsByIdQuery = async (name) => {
  let connection;
  try {
    connection = await getConnection();
    const [news] = await connection.query(
      `SELECT id, name FROM photonews WHERE name = ?`,
      [name]
    )
  
    return name;
  } finally {
    if(connection) connection.release();
  }
}

module.exports = selectPhotoNewsByIdQuery;