const getConnection = require("../../getConnection");

const selectCategoriesByIdUserQuery = async (idUser, category) => {
  let connection;

  try {
    connection = await getConnection();
    const [categories] = await connection.query(
      `
    SELECT id, idUser, name, comment, createdAt FROM categories WHERE idUser = ? AND name = ?`,
      [idUser, category]
    );  
    
    console.log("Categoría seleccionada: ", categories[0]);

    return categories[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectCategoriesByIdUserQuery;