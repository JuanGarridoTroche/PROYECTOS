const getConnection = require("../../getConnection");

const selectEntriesByCatNameQuery = async (catName, idAccount) => {
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
    SELECT id, idAccount, dateEntry, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE category = ? AND idAccount = ?`,
      [catName, idAccount]
    );   

    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntriesByCatNameQuery;