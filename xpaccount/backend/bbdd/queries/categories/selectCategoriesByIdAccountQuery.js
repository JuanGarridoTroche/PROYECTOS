const getConnection = require("../../getConnection");

const selectCategoriesByIdAccountQuery = async (idAccount) => {
  let connection;

  try {
    connection = await getConnection();
    const [categories] = await connection.query(
      `
    SELECT id, idAccount, name, comment, createdAt, modifiedAt FROM categories WHERE idAccount = ?`,
      [idAccount]
    );   

    return categories;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoriesByIdAccountQuery;