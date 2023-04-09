const getConnection = require("../../getConnection");

const selectEntriesByCatNameQuery = async (catName) => {
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
    SELECT id, idAccount, dateEntry, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE category = ?`,
      [catName]
    );   

    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntriesByCatNameQuery;