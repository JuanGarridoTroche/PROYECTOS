const getConnection = require("../../getConnection");

const selectUserByEmailQuery = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
    SELECT id, username, password, birthday, firstName, lastName, dni, active FROM users WHERE email = ?`,
      [email]
    );   
      
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByEmailQuery;