"use strict";

const {generateError} = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectUserByIdQuery = async (idUser) => {
  
  let connection;
  try {
    connection = await getConnection();

    const [users] = await connection.query(
      `
    SELECT id, username, email, bio, photo, role, active, createdAt FROM users WHERE id = ?`,
      [idUser]
    );
       

    // Comprobamos que existe un registro en el resultado de la consulta a la BBDD
    if (users.length < 1) {
      throw generateError("Usuario no encontrado", 404);
    }
 
    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdQuery;
