const getConnection = require("../../getConnection");

const insertAccountQuery = async({idUser, alias, bankName, ibanCode, entityCode, officeCode, digitControl, number}) => {
  console.log(idUser);
  let connection;
  try {
    connection = await getConnection();

    const [newAccount] = await connection.query(
      `
      INSERT INTO accounts (idUser, alias, bankName, ibanCode, entityCode, officeCode, digitControl, number, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idUser, alias, bankName, ibanCode, entityCode, officeCode, digitControl, number, new Date()]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = insertAccountQuery;