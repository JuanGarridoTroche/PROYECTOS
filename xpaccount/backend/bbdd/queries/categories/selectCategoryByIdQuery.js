const getConnection = require("../../getConnection");

const selectCategoryByIdQuery = async (idUser, idCategory) => {
  let connection;

  try {
    connection = await getConnection();
    const [category] = await connection.query(
      `
    SELECT id, idUser, name, comment, createdAt FROM categories WHERE idUser = ? AND id = ?`,
      [idUser, idCategory]
    );   

    return category[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoryByIdQuery;