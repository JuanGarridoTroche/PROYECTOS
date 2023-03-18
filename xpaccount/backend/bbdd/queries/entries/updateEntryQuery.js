const getConnection = require("../../getConnection");

const updateEntryQuery = async ({idAccount, category, subcategory, amount, concept, comment, idEntry}) => {
  let connection;

  console.log(idAccount, category, subcategory, amount, concept, comment, idEntry);

  try {
    connection = await getConnection();
    await connection.query(
      `
      UPDATE entries SET idAccount = ?, category = ?, subcategory= ?, amount = ?, concept = ?, comment = ?, modifiedAt = ? WHERE id = ?`,
      [idAccount, category, subcategory, amount, concept, comment, new Date(), idEntry]
    );   

  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateEntryQuery;