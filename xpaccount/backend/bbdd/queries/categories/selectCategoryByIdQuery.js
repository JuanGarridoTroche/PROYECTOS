const getConnection = require("../../getConnection");

const selectCategoryByIdQuery = async (idAccount, idCategory) => {
  let connection;

  try {
    connection = await getConnection();
    const [category] = await connection.query(
      `
    SELECT id, idAccount, name, comment, createdAt, modifiedAt FROM categories WHERE idAccount = ? AND id = ?`,
      [idAccount, idCategory]
    );   

    return category[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoryByIdQuery;