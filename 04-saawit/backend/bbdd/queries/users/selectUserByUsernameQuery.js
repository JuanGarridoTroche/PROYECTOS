"use strict";

const {generateError} = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectUserByUsernameQuery = async (username) => {
  let connection;
  try {
    connection = await getConnection();

    if(!username) return;

    
    const [usernames] = await connection.query(
      `
      SELECT id, username, email, photo, role, active, createdAt FROM users WHERE username = ?`,
      [username]
      );

    // Comprobamos que existe un registro en el resultado de la consulta a la BBDD
    if (usernames.length > 0) {
      throw generateError(`El usuario ${username} ya está registrado en nuestra base de datos. Elige otro username`, 403);
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByUsernameQuery;
