'use strict';

const getConnection = require('../../getConnection');

const updateNewsQuery = async (idNews, feedback) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE news SET feedback = ?, modifiedAt = ? WHERE id = ?`,
      [feedback, new Date(), idNews]
    )
    
  } finally {
    if(connection) connection.release();
  }
}

module.exports = updateNewsQuery;