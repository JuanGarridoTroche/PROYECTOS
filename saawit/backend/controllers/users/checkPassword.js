"use strict";

const getConnection = require("../../bbdd/getConnection");
const bcrypt = require("bcrypt");
const { generateError } = require("../../helpers");
const selectPasswordByIdQuery = require("../../bbdd/queries/users/selectPasswordByIdQuery");

const checkPassword = async (password, idUser) => {
  let connection;
  try {
    connection = await getConnection();

    //Vamos a comprobar quye existe el email en nuestra base de datos
    const user = await selectPasswordByIdQuery(idUser);

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
