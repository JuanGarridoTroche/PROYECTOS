const getConnection = require("../../getConnection");

const updateSubcategoryAllEntriesQuery = async (nameSubcat, oldSub) => {
  console.log("Nuevo nombre: ", nameSubcat, "Nombre antiguo", oldSub.toUpperCase());
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
      UPDATE entries SET subcategory= ?, modifiedAt = ? WHERE subcategory = ?`,
      [nameSubcat.toUpperCase(), new Date(), oldSub.toUpperCase()]
    );   
      
      return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateSubcategoryAllEntriesQuery;