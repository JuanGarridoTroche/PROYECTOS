const getConnection = require("../../getConnection");

const selectSubcatByIdCatAndIdSubQuery = async (idCategory, idsub) => {
  let connection;

  try {
    connection = await getConnection();
    const [subcategory] = await connection.query(
      `
    SELECT id, idCat, name, comment, createdAt FROM subcategories WHERE idCat = ? AND id = ?`,
      [idCategory, idsub]
    ); 

    return subcategory[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectSubcatByIdCatAndIdSubQuery;