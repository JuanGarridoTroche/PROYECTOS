const getConnection = require("../../BBDD/getConnection");

const updateUserDataQuery = async ({id, newEmail, first_name, last_name1, last_name2}) => {
  let connection;

  try {
    connection = await getConnection();    

    // Actualizamos el usuario
    await connection.query(
      `UPDATE users SET email= ?, first_name = ?, last_name1 = ?, last_name2 = ?, modifiedAt = ? WHERE id = ?`,
      [newEmail, first_name, last_name1, last_name2, new Date(), id]
    )
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserDataQuery;