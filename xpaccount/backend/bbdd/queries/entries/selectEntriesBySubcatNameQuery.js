const getConnection = require("../../getConnection");

const selectEntriesBySubcatNameQuery = async (subcatName) => {
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
    SELECT id, idAccount, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE subcategory = ?`,
      [subcatName]
    );   

    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntriesBySubcatNameQuery;