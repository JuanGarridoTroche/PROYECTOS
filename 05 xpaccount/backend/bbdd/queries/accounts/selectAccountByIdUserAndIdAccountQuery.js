const getConnection = require("../../getConnection");

const selectAccountByIdUserAndIdAccountQuery = async (idUser, idAccount) => {  
  let connection;

  try {
    connection = await getConnection();
    const [account] = await connection.query(
      `
    SELECT id, idUser, alias, bankName, accountNumber FROM accounts WHERE idUser = ? AND id = ?`,
      [idUser, idAccount]
    );    
    
    return account[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAccountByIdUserAndIdAccountQuery;