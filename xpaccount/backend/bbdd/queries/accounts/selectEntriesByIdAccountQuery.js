const getConnection = require("../../getConnection");

const selectEntriesByIdAccountQuery = async (idAccount) => {  
  let connection;  

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
    SELECT id, idAccount, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE idAccount = ?`,
    [idAccount]
    );
    console.log(entries);
    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntriesByIdAccountQuery;