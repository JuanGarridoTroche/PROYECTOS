const getConnection = require("../../getConnection");

const insertNewSubcatQuery = async (idCategory, nameSubcat, comment) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `
    INSERT INTO subcategories (idCat, name, comment, createdAt)
    VALUES (?, ?, ?, ?)`,
      [idCategory, nameSubcat.toUpperCase(), comment, new Date()]
    );   
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertNewSubcatQuery;