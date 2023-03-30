const getConnection = require("../../getConnection");

const selectSubcatsByIdCatQuery = async (idCategory) => {
  let connection;

  try {
    connection = await getConnection();
    const [subcategories] = await connection.query(
      `
    SELECT id, idCat, name, comment, createdAt FROM subcategories WHERE idCat = ? ORDER BY name ASC`,
      [idCategory]
    ); 

    return subcategories;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectSubcatsByIdCatQuery;