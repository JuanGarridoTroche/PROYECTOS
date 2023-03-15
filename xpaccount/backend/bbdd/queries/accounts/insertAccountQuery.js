const getConnection = require("../../getConnection");

const insertAccountQuery = async({idUser, alias, bankName, numberAccount}) => {
  console.log(idUser);
  let connection;
  try {
    connection = await getConnection();

    const [newAccount] = await connection.query(
      `
      INSERT INTO accounts (idUser, alias, bankName, numberAccount, createdAt)
      VALUES (?, ?, ?, ?, ?)`,
      [idUser, alias, bankName, numberAccount, new Date()]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = insertAccountQuery;