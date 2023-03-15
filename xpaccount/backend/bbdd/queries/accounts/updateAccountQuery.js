const getConnection = require("../../getConnection");

const updateAccountQuery = async({idAccount, alias, bankName}) => {  
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `
      UPDATE accounts (alias, bankName, modifiedAt)
      VALUES (?, ?, ?, ?, ?)`,
      [idUser, alias, bankName, accountNumber, new Date()]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateAccountQuery;