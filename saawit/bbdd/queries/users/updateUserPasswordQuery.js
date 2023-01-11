"use strict";

const getConnection = require("../../getConnection");
const bcrypt = require("bcrypt");

const updateUserPasswordQuery = async (password, idUser) => {
  let connection;
  try {
    connection = await getConnection();

    // Encriptamos la contraseña
    const hashPass = await bcrypt.hash(password, 10);

    // Actualizamos la password encriptada en la BBDD
    await connection.query(
      `
    UPDATE users SET password = ?, recoverPassCode = null, active = 1, modifiedAt = ? WHERE id = ?`,
      [hashPass, new Date(), idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserPasswordQuery;
