"use strict";
const joi = require("@hapi/joi");
const { generateError } = require("../../helpers");
const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const newUser = async (req, res, next) => {
  try {
    const { username, email, password, bio } = req.body;

    // Validamos el correo electrónico
    // Para ello vamos a utilizar la dependecia de validadción de datos joi
    const schemaEmail = joi
      .string()
      .email()
      .required()
      .error(new Error("Introduzca una cuenta de correo válida", 400));
    const validationEmail = schemaEmail.validate(email);

    if (validationEmail.error || validationEmail === null) {
      throw generateError(validationEmail.error.message);
    }

    //Validamos el nombre de usuario
    const schemaUserName = joi
      .string()
      .min(4)
      .max(100)
      .required()
      .error(
        new Error(
          "Introduzca un nombre de usuario válido de al menos 4 caracteres",
          400
        )
      );
    const validationUserName = schemaUserName.validate(username);

    if (validationUserName.error || validationUserName === null) {
      throw generateError(validationUserName.error.message);
    }

    //Validamos la contraseña
    const schemaPwd = joi
      .string()
      .min(8)
      .max(100)
      .required()
      .error(new Error("La contraseña debe tener al menos 8 caracteres", 403));
    const validationPwd = schemaPwd.validate(password);

    if (validationPwd.error || validationPwd === null) {
      throw generateError(validationPwd.error.message);
    }

    // Comprobar que el nombre de usuario y la cuenta de correo no estén registrados ya en nuestra BBDD. Si no existe insertamos el usuario.

    
    await insertUserQuery(username, email, password, bio);

    res.send({
      status: "ok",
      message: "Usuario creado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
