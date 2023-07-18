const getConnection = require('../../ddbb/getConnection');

const selectPasswordByEmailQuery = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
        SELECT password FROM users WHERE email = ?`,
      [email]
    );
    // console.log(user);
    return user[0].password;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPasswordByEmailQuery;
