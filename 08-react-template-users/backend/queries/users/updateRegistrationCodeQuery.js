const getConnection = require("../../BBDD/getConnection");


const updateRegistrationCodeQuery = async (id, registrationCode) => {
  let connection;

  try {
    // Conexión a BBDD
    connection = await getConnection();     

    await connection.query(
      `UPDATE users SET registrationCode = ?, modifiedAt = ? WHERE id = ?`,
      [registrationCode, new Date(), id]
    )
  } finally {
    // Cerramos la conexión a BBDD
    if (connection) connection.release();
  }
};

module.exports = updateRegistrationCodeQuery;
