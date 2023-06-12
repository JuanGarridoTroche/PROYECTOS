const getConnection = require("../../getConnection");


const deleteSubcategoryByIdQuery = async (idCategory, idSub) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM subcategories WHERE idCat = ? AND id = ?`,
      [idCategory, idSub]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = deleteSubcategoryByIdQuery;