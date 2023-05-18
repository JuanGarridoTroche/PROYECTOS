"use strict";

const getConnection = require("../../BBDD/getConnection");
const { generateError } = require("../../helpers");

const checkRecoverPasswordQuery = async (recoverPassCode) => {
  let connection;
  try {
    connection = await getConnection();

    const [check] = await connection.query(
      `
    SELECT id FROM users WHERE recoverPassCode = ?`,
      [recoverPassCode]
    );
    
    // Comprobamos que existe un registro en el resultado de la consulta a la BBDD
    if (!check[0]) {
      throw generateError("Pass Code incorrecto", 404);
    }
  
    return check[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = checkRecoverPasswordQuery;