const getConnection = require("../../getConnection");

const insertEntryQuery = async (idAccount, entry) => {
  let connection;
  const {dateEntry, category, subcategory, amount, concept, comment } = entry;

  // Pasamos la fecha dd/mm/aaaa a aaa/mm/dd para poder guardarla correctamente
  let dateEntryValue = dateEntry.split("/", 3).reverse().join("/");  

  try {
    connection = await getConnection();
    await connection.query(
      `
      INSERT INTO entries (idAccount, dateEntry, category, subcategory, amount, concept, comment, createdAt)
      VALUES (?,?,?,?,?,?,?,?)`,
      [idAccount, dateEntryValue, category, subcategory, amount, concept, comment, new Date()]
    );  
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertEntryQuery;