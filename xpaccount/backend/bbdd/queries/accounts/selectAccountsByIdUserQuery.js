const getConnection = require("../../getConnection");

const selectAccountsByIdUserQuery = async (idUser) => {  
  let connection;

  try {
    connection = await getConnection();
    const [idUserAccounts] = await connection.query(
      `
    SELECT id, idUser, alias, bankName, accountNumber FROM accounts WHERE idUser = ?`,
      [idUser]
    );    
    return idUserAccounts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAccountsByIdUserQuery;