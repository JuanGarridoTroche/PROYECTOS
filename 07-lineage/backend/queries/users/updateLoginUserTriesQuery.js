const getConnection = require("../../BBDD/getConnection");

const updateLoginUserTriesQuery = async (id) => {
  let connection;

  try {
    connection = await getConnection();    

    // Actualizamos los intentos a 0
    await connection.query(
      `UPDATE users SET tries = 0, modifiedAt = ? WHERE id = ?`,
      [new Date(), id]
    )
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateLoginUserTriesQuery;