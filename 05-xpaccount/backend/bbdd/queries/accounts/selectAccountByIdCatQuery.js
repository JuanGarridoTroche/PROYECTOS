const getConnection = require("../../getConnection");

const selectAccountByIdCatQuery = async (idCategory) => {  
  let connection;  
  try {
    connection = await getConnection();
    const [account] = await connection.query(
      `
    SELECT id, idAccount, name, comment, createdAt, modifiedAt FROM categories WHERE id = ?`,
    [idCategory]
    );
    
    return account[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAccountByIdCatQuery;