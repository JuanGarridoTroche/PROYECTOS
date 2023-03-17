const getConnection = require("../../getConnection");

const insertNewCatQuery = async (idUser, category, comment) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO categories (idUser, name, comment, createdAt)
    VALUES (?, ?, ?, ?)`,
      [idUser, category.toUpperCase(), comment, new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewCatQuery;