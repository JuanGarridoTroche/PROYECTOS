const getConnection = require("../../getConnection");

const selectCategoriesByIdUserQuery = async (idUser, category) => {
  let connection;

  try {
    connection = await getConnection();
        
    const [cat] = await connection.query(
      `
    SELECT id, idUser, name, comment, createdAt, modifiedAt FROM categories WHERE idUser = ? AND name = ?`,
      [idUser, category.toUpperCase()]
    );   

    return cat[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoriesByIdUserQuery;