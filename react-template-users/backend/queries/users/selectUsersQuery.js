const { generateError } = require("../../helpers");
const getConnection = require("../../BBDD/getConnection");

const selectUsersQuery = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT id, email, role, first_name, last_name1, last_name2, active, tries, createdAt, modifiedAt FROM users`     
    );

    if (users.length < 1) {
      throw generateError("credenciales inválidas", 403);
    }
        
    return users;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUsersQuery;