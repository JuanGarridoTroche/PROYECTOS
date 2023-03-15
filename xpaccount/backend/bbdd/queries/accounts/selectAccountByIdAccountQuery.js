const getConnection = require("../../getConnection");

const selectAccountByIdAccountQuery = async (idAccount) => {  
  let connection;

  try {
    connection = await getConnection();
    const [account] = await connection.query(
      `
    SELECT id, idUser, alias, bankName, accountNumber FROM accounts WHERE id = ?`,
      [idAccount]
    );    
    return account[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAccountByIdAccountQuery;