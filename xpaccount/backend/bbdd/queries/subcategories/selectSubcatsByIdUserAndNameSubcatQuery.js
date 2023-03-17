const getConnection = require("../../getConnection");

const selectSubcatsByIdUserAndNameSubcatQuery = async (idUser, nameSubcat) => {
  let connection;

  try {
    connection = await getConnection();
    const [categories] = await connection.query(
      `
    SELECT id, idUser, name, comment, createdAt FROM subcategories WHERE idUser = ? AND name = ?`,
      [idUser, nameSubcat]
    ); 

    return categories[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectSubcatsByIdUserAndNameSubcatQuery;