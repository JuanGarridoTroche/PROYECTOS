const getConnection = require("../../getConnection");


const deleteSubcategoriesByIdCatQuery = async (idCategory) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM subcategories WHERE idCat = ?`,
      [idCategory]
    )
  } finally {
    if(connection) connection.release();
  }
}

module.exports = deleteSubcategoriesByIdCatQuery;