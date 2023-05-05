const { generateError } = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectUserByEmailQuery = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT id, email, password, role, first_name, last_name1, last_name2, active, createdAt, modifiedAt FROM users WHERE email = ?`,
      [email]
    );

    if (users.length < 1) {
      throw generateError("Email y/o contraseña inválidos", 404);
    }

    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByEmailQuery;