const getConnection = require("../../BBDD/getConnection");

const updateDeactivateUserQuery = async (id) => {
  let connection;

  try {
    connection = await getConnection();    

    // Actualizamos el usuario
    await connection.query(
      `UPDATE users SET active = false, modifiedAt = ? WHERE id = ?`,
      [new Date(), id]
    )
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateDeactivateUserQuery;