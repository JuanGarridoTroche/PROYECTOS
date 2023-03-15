const getConnection = require("../../getConnection");

const updateAccountQuery = async({idAccount, alias, bankName}) => {  
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `      
      UPDATE accounts SET alias = ?, bankName = ?, modifiedAt = ? WHERE id = ?`,
      [alias, bankName, new Date(), idAccount]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateAccountQuery;