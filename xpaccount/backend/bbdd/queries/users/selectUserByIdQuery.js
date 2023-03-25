const getConnection = require("../../getConnection");

const selectUserByIdQuery = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT id, username, email, birthday, firstName, lastName, dni, active, createdAt, modifiedAt FROM users WHERE id = ?`,
      [id]
    );    
    
    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdQuery;