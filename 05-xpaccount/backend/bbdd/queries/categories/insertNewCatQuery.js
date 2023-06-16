const getConnection = require("../../getConnection");

const insertNewCatQuery = async (idAccount, category, comment) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO categories (idAccount, name, comment, createdAt)
    VALUES (?, ?, ?, ?)`,
      [idAccount, category.toUpperCase(), comment, new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewCatQuery;