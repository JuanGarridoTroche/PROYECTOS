const getConnection = require("../../getConnection");


const deleteCategoryByIdQuery = async (idCategory, idUser) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM categories WHERE id = ? AND idUser = ?`,
      [idCategory, idUser]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = deleteCategoryByIdQuery;