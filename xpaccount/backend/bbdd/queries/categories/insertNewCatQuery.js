const getConnection = require("../../getConnection");

const insertNewCatQuery = async (idUser, category) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO categories (idUser, name, createdAt)
    VALUES (?, ?, ?)`,
      [idUser, category.toUpperCase(), new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewCatQuery;