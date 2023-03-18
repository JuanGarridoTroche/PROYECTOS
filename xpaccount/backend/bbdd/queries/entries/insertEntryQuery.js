const getConnection = require("../../getConnection");

const insertEntryQuery = async (idAccount, entry) => {
  let connection;
  const {category, subcategory, amount, concept, comment } = entry;

  try {
    connection = await getConnection();
    await connection.query(
      `
      INSERT INTO entries (idAccount, category, subcategory, amount, concept, comment, createdAt)
      VALUES (?,?,?,?,?,?,?)`,
      [idAccount, category, subcategory, amount, concept, comment, new Date()]
    );  
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertEntryQuery;