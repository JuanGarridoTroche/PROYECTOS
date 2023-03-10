const {generateError} = require("../../../helpers");
const getConnection = require("../../getConnection");
const bcrypt = require('bcrypt');

const insertUserQuery = async (username, email, password, birthday, firstName, lastName, dni, registrationCode) => {
  let connection;


  
  try {
    // Conexión a BBDD
    connection = await getConnection();

    const formattedBirthday = birthday.split("/", 3).reverse().join("/"); 

    //Intentamos obtener un username con el que nos ha dado el usuario
    const [users] = await connection.query(
      `
      SELECT id FROM users WHERE username = ?`,
      [username]
    );

    if (users.length > 0) {
      throw generateError(
        "El nombre de usuario ya existe en nuestra Base de datos. Por favor, introduce otro nombre de usuario", 403
      );
    }

    const [emailUsers] = await connection.query(
      `
    SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (emailUsers.length > 0) {
      throw generateError(
        "El email ya está registrado. Por favor, introduce otro email correcto", 403
      );
    }

    // Encriptamos la contraseña
    const hashPass = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO users (username, email, password, birthday, firstName, lastName, dni, registrationCode, active, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [username, email, hashPass, new Date(formattedBirthday), firstName, lastName, dni.toUpperCase(), registrationCode, new Date()]
    );
  } finally {
    // Cerramos la conexión a BBDD
    if (connection) connection.release();
  }
};

module.exports = insertUserQuery;