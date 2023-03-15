const getConnection = require("../../getConnection");


const deleteAccountByIdQuery = async (idAccount, idUser) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM accounts WHERE id = ? AND idUser = ?`,
      [idAccount, idUser]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = deleteAccountByIdQuery;