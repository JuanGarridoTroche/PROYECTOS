"use strict";

const getConnection = require("../../BBDD/getConnection");
const bcrypt = require("bcrypt");
const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");


const checkPassword = async (password, email) => {
  let connection;
  try {
    connection = await getConnection();

    //Vamos a comprobar que existe el email en nuestra base de datos
    const user = await selectUserByEmailQuery(email);

    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw generateError("La contraseña antigua es incorrecta", 400);
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = checkPassword;