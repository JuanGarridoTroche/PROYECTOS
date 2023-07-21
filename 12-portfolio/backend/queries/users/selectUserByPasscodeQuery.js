const getConnection = require('../../ddbb/getConnection');

const selectUserByPasscodeQuery = async (passcode) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
        SELECT id, firstName, lastName1, lastName2, email, image, address, postcode, locality, province, country, createdAt, modifiedAt FROM users WHERE recoverPasscode = ?`,
      [passcode]
    );
    console.log(user[0]);
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByPasscodeQuery;
