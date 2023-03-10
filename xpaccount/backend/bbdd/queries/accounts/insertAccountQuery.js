const getConnection = require("../getConnection");

const insertAccountQuery = async ({
  idUser,
  alias,
  bankname,
  ibanCode,
  entityCode,
  officeCode,
  digitControl,
  number,
}) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos la cuanta bancaria
    const [account] = await connection.query(
      `
    INSERT INTO accounts (idUser, alias, bankname, ibanCode, entityCode, officeCode, digitControl, number, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idUser,
        alias,
        bankname,
        ibanCode,
        entityCode,
        officeCode,
        digitControl,
        number,
        new Date(),
      ]
    );
      console.log(account, account[0]);
    return account[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertAccountQuery;
