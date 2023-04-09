const getConnection = require("../../getConnection");

const updateCategoryAllEntriesQuery = async (nameSubcat, oldSub) => {
  console.log("Nuevo nombre: ", nameSubcat, "Nombre antiguo", oldSub.toUpperCase());
  let connection;

  try {
    connection = await getConnection();
    const [entries] = await connection.query(
      `
      UPDATE entries SET category= ?, modifiedAt = ? WHERE category = ?`,
      [nameSubcat.toUpperCase(), new Date(), oldSub.toUpperCase()]
    );   
      
      return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateCategoryAllEntriesQuery;