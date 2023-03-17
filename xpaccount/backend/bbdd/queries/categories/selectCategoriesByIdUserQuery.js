const getConnection = require("../../getConnection");

const selectCategoriesByIdUserQuery = async (idUser, category) => {
  let connection;
  console.log(idUser, category);

  try {
    connection = await getConnection();
    const [categories] = await connection.query(
      `
    SELECT id, idUser, name, subcategory, comment, createdAt FROM categories WHERE idUser = ? AND name = ?`,
      [idUser, category]
    );   
    console.log(categories[0]);

    return categories[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoriesByIdUserQuery;