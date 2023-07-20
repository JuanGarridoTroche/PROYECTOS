const getConnection = require('../../ddbb/getConnection');

const selectPasswordByIdQuery = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
        SELECT password FROM users WHERE id = ?`,
      [id]
    );
    // console.log(user);
    return user[0].password;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPasswordByIdQuery;
