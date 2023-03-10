const getConnection = require("../getConnection");

const Query = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT id, username, password, birthday, firstName, lastName, dni, active FROM users WHERE email = ?`,
      [email]
    );   

    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = Query;