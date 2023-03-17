const getConnection = require("../../getConnection");

const insertNewCatQuery = async (idUser, category) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO categories (idUser, UPPER(name), createdAt)
    VALUES (?, ?, ?)`,
      [idUser, category, new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewCatQuery;