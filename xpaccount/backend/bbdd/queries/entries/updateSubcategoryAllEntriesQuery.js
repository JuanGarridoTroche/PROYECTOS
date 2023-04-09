const getConnection = require("../../getConnection");

const updateSubcategoryAllEntriesQuery = async (nameSubcat, oldSub) => {
  console.log(nameSubcat, oldSub);
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
      UPDATE entries SET subcategory= ?, modifiedAt = ? WHERE subcategory = ?`,
      [nameSubcat, new Date(), oldSub]
    );   
      console.log("Asientos modificados: ", entries);
      return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateSubcategoryAllEntriesQuery;