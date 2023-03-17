const getConnection = require("../../getConnection");

const selectSubcategoriesByIdUserQuery = async (idCategory, nameSubcat) => {
  let connection;

  try {
    connection = await getConnection();
    const [subcategories] = await connection.query(
      `
    SELECT id, idCat, name, comment, createdAt FROM subcategories WHERE idCat = ? AND name = ?`,
      [idCategory, nameSubcat]
    );   

    return subcategories[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectSubcategoriesByIdUserQuery;