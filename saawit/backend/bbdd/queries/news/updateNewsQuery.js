'use strict';

const { generateError } = require('../../../helpers');
const getConnection = require('../../getConnection');


const updateNewsQuery = async (category, title, summary, body, idNews) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE news SET category = ?, title = ?, summary = ?, body = ?, modifiedAt = ? WHERE id = ?`,
      [category, title, summary, body, new Date(), idNews]
    )
    
  } finally {
    if(connection) connection.release();
  }
}

module.exports = updateNewsQuery;