"use strict";

const getConnection = require("../../ddbb/getConnection");
const bcrypt = require("bcrypt");
const { handleError } = require("../../helpers");
const selectPasswordByIdQuery = require("../../queries/users/selectPasswordByIdQuery");


const checkPassword = async (password, id) => {
  let connection;
  try {
    connection = await getConnection();

    //Vamos a comprobar que existe el id en nuestra base de datos
    const hash = await selectPasswordByIdQuery(id);
    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, hash);
    if (!validPassword) {
      // console.log("La contraseña original es incorrecta");
      throw handleError("La contraseña es incorrecta", 400);
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = checkPassword;