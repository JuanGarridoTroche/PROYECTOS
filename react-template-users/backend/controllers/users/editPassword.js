"use strict";

const { generateError } = require("../../helpers");
const joi = require('@hapi/joi');
const checkPassword = require("../../controllers/users/checkPassword");
const updateUserPasswordQuery = require("../../queries/users/updateUserPasswordQuery");

const editPassword = async (req, res, next) => {
  try {
    const { password, newPassword, newPasswordRepeated } = req.body;

    //Comprobar que que los 3 campos tengan algún valor
    if (!password || !newPassword || !newPasswordRepeated) {
      throw generateError("Faltan campos", 400);
    }

    // Comprobamos que newPassword y newPasswordRepeated sean iguales
    if (newPassword !== newPasswordRepeated) {
      throw generateError(
        "La contraseña nueva no es igual en ambos campos",
        400
      );
    }

    // Comprobamos que la password es la correcta en nuestra BBDD
    await checkPassword(password, req.user.id);

    // Validamos la nueva contraseña
    const myPwd = newPassword.split('');
    const specCharPattern = /^[_!@#$%&*]{1,47}$/;
    const lcPattern = /^[a-z]{1,47}$/;
    const ucPattern = /^[A-Z]{1,47}$/;

    const pwdSchema = joi
      .array()
      .items(
        joi.string().required().regex(specCharPattern),
        joi.string().required().regex(lcPattern),
        joi.string().required().regex(ucPattern),
        joi.number().required()
      )
      .min(8)
      .max(50);
    
    const pwdValidation = pwdSchema.validate(myPwd);

    if (pwdValidation.error || pwdValidation === null) {
      throw generateError(
        'La contraseña debe tener al menos 8 caracteres y contener un número, una minúscula, una mayúscula y un caracter especial'
      );
    }

    //Actualizamos la contraseña del usuario
    await updateUserPasswordQuery(newPassword, req.user.id);

    res.send({
      status: "Ok",
      message: "Contraseña actualizada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editPassword;
