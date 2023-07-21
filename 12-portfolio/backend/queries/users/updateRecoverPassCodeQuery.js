const getConnection = require('../../ddbb/getConnection');

const updateRecoverPassCodeQuery = async (recoverPassCode, id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
        UPDATE users SET recoverPassCode = ?, modifiedAt = ? WHERE id = ?`,
      [recoverPassCode, new Date(), id]
    );
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateRecoverPassCodeQuery;
