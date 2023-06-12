const getConnection = require("../../getConnection");

const updateCategoryQuery = async({idCategory, category, comment}) => {  
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `      
      UPDATE categories SET name = ?, comment = ?, modifiedAt = ? WHERE id = ?`,
      [category.toUpperCase(), comment, new Date(), idCategory]
    )
    
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateCategoryQuery;