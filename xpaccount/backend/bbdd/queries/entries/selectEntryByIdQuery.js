const getConnection = require("../../getConnection");

const selectEntryByIdQuery = async (idEntry) => {
  let connection;

  try {
    connection = await getConnection();
    const [entry] = await connection.query(
      `
    SELECT id, idAccount, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE id = ?`,
      [idEntry]
    );   

    return entry[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntryByIdQuery;