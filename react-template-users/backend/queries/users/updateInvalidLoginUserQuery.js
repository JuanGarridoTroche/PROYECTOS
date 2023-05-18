const getConnection = require("../../BBDD/getConnection");

const updateInvalidLoginUserQuery = async (id, tries) => {
  let connection;

  try {
    connection = await getConnection();    

    // Actualizamos el usuario con el número de intentos erróneos de login
    await connection.query(
      `UPDATE users SET active = true, tries = ?, modifiedAt = ? WHERE id = ?`,
      [tries, new Date(), id]
    )
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateInvalidLoginUserQuery;