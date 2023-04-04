const getConnection = require("../../getConnection");

const updateEntryQuery = async ({idAccount, category, subcategory, amount, concept, comment, idEntry}) => {
  let connection;

  try {
    connection = await getConnection();
    const [entry] = await connection.query(
      `
      UPDATE entries SET idAccount = ?, category = ?, subcategory= ?, amount = ?, concept = ?, comment = ?, modifiedAt = ? WHERE id = ?`,
      [idAccount, category, subcategory, amount, concept, comment, new Date(), idEntry]
    );   
    console.log(entry[0]);
      return entry[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateEntryQuery;