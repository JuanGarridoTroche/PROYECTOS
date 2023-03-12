const getConnection = require("../../getConnection");

const selectAccountsByIdUserQuery = async (idUser) => {  
  let connection;

  try {
    connection = await getConnection();
    const [idUserAccounts] = await connection.query(
      `
    SELECT id, idUser, alias, bankName, ibanCode, entityCode, officeCode, digitControl, number FROM accounts WHERE idUser = ?`,
      [idUser]
    );    
    console.log(idUserAccounts);
    return idUserAccounts[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAccountsByIdUserQuery;