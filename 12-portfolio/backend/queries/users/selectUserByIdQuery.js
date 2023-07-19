const getConnection = require('../../ddbb/getConnection');

const selectUserByIdQuery = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
        SELECT id, firstName, lastName1, lastName2, email, image, address, postcode, locality, province, country, createdAt, modifiedAt FROM users WHERE id = ?`,
      [id]
    );
    // console.log(user);
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdQuery;
