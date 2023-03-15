const getConnection = require("../../getConnection");

const insertAccountQuery = async({idUser, alias, bankName, accountNumber}) => {  
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `
      INSERT INTO accounts (idUser, alias, bankName, accountNumber, createdAt)
      VALUES (?, ?, ?, ?, ?)`,
      [idUser, alias, bankName, accountNumber, new Date()]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = insertAccountQuery;