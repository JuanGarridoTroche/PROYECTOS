const getConnection = require("../../getConnection");

const deleteEntryQuery = async (idEntry, idAccount) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    DELETE FROM entries WHERE id = ? AND idAccount = ?`,
      [idEntry, idAccount]
    );   

  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteEntryQuery;