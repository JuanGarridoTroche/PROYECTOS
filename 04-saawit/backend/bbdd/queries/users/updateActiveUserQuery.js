'use strict';

const getConnection = require('../../getConnection');


const updateActiveUserQuery = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE user SET active = 0 WHERE id = ?`,
      [id]
    )
    
  } finally {
    if(connection) connection.release();
  }
}

module.exports = updateActiveUserQuery;