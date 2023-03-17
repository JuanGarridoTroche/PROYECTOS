const getConnection = require("../../getConnection");

const insertNewCatQuery = async (idCategory, nameSubcat, comment) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO subcategories (idCat, name, comment, createdAt)
    VALUES (?, ?, ?, ?)`,
      [idCategory, nameSubcat, comment, new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewCatQuery;