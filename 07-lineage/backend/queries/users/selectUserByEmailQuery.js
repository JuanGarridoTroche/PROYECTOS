const getConnection = require("../../BBDD/getConnection");

const selectUserByEmailQuery = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
    SELECT id, email, password, role, first_name, last_name1, last_name2, active, tries, createdAt, modifiedAt FROM users WHERE email = ?`,
      [email]
    );   
    
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByEmailQuery;