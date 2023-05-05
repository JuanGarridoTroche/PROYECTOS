const { generateError } = require("../helpers");
const getConnection = require("../../getConnection");

const selectUserByEmailQuery = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT id, username, password, role, bio, active FROM users WHERE email = ?`,
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