
const { generateError } = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectMailByEmailQuery = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    if(!email) return;
    
    const [users] = await connection.query(
      `
    SELECT id, username, password, role, bio, active FROM users WHERE email = ?`,
      [email]
    );

    if (users.length > 0) {
      throw generateError('El email ya existe en nuestra base de datos. Elige otro correo válido', 403);
  }

  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectMailByEmailQuery;
