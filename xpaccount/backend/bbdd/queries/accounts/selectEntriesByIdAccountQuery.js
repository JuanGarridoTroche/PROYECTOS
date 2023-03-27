const getConnection = require("../../getConnection");

const selectEntriesByIdAccountQuery = async (idAccount) => {  
  let connection;  

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
    SELECT id, idAccount, DATE_FORMAT(dateEntry, "%d/%m/%Y") AS dateEntry, category, subcategory, amount, concept, comment, createdAt, modifiedAt FROM entries WHERE idAccount = ? ORDER BY entries.dateEntry ASC`,
    [idAccount]
    );
    
    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntriesByIdAccountQuery;