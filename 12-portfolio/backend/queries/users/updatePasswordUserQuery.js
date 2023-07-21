const getConnection = require('../../ddbb/getConnection');

const updatePasswordUserQuery = async (hashPass, id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
        UPDATE users SET password = ?, modifiedAt = ? WHERE id = ?`,
      [hashPass, new Date(), id]
    );
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updatePasswordUserQuery;
