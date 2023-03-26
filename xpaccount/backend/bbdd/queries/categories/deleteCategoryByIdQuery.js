const getConnection = require("../../getConnection");


const deleteCategoryByIdQuery = async (idCategory, idAccount) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM categories WHERE id = ? AND idAccount = ?`,
      [idCategory, idAccount]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = deleteCategoryByIdQuery;