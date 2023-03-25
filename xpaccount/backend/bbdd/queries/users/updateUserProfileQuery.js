const getConnection = require("../../getConnection");

const updateUserProfileQuery = async ({idUser, birth, firstName, lastName, dni}) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
    UPDATE users SET birthday = ?, firstName = ?, lastName = ?, dni = ?, modifiedAt = ? WHERE id = ?`,
      [birth, firstName, lastName, dni, new Date(), idUser]
    );         
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserProfileQuery;