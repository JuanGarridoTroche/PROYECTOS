const {generateError} = require("../../helpers");
const getConnection = require("../../BBDD/getConnection");
const bcrypt = require('bcrypt');

const insertUserQuery = async ({email, password, first_name, last_name1, last_name2}) => {
  let connection;

  try {
    // Conexión a BBDD
    connection = await getConnection();

    //Intentamos obtener un email con el que nos ha dado el usuario
    const [emailUser] = await connection.query(
      `
    SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (emailUser.length > 0) {
      throw generateError(
        "El email ya está registrado. Por favor, introduce un email válido", 403
      );
    }

    // Encriptamos la contraseña
    const hashPass = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO users (email, password, first_name, last_name1, last_name2, active, createdAt)
    VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [email, hashPass, first_name, last_name1, last_name2,  new Date()]
    );
  } finally {
    // Cerramos la conexión a BBDD
    if (connection) connection.release();
  }
};

module.exports = insertUserQuery;
