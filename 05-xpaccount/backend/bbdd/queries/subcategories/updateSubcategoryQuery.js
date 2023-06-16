const getConnection = require("../../getConnection");

const updateSubcategoryQuery = async({ idSub, nameSubcat, comment}) => {  
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `      
      UPDATE subcategories SET name = ?, comment = ?, modifiedAt = ? WHERE id = ?`,
      [nameSubcat.toUpperCase(), comment, new Date(), idSub]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateSubcategoryQuery;