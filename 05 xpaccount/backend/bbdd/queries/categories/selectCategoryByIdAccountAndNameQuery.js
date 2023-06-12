const getConnection = require("../../getConnection");

const selectCategoryByIdAccountAndNameQuery = async (idAccount, category) => {
  let connection;

  try {
    connection = await getConnection();
        
    const [cat] = await connection.query(
      `
    SELECT id, idAccount, name, comment, createdAt, modifiedAt FROM categories WHERE idAccount = ? AND name = ?`,
      [idAccount, category.toUpperCase()]
    );   

    return cat[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoryByIdAccountAndNameQuery;