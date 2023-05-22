"use strict";

const joi = require("@hapi/joi");
const { generateError } = require("../../helpers");
const checkRecoverPasswordQuery = require("../../queries/users/checkRecoverPasswordQuery");
const updateUserPasswordQuery = require("../../queries/users/updateUserPasswordQuery");

const recoverPassword = async (req, res, next) => {
  try {
    const { recoverPassCode, newPassword, newPasswordRepeated } = req.body;

    //Comprobar que que los 3 campos tengan algún valor
    if (!recoverPassCode || !newPassword || !newPasswordRepeated) {
      throw generateError("Faltan campos", 400);
    }

    // Comprobamos que newPassword y newPasswordRepeated sean iguales
    if (newPassword !== newPasswordRepeated) {
      throw generateError(
        "La contraseña nueva no es igual en ambos campos",
        400
      );
    }

    // Validamos que la contraseña tenga como mínimo 8 caracteres y contenga al menos un caracter en mayúsculas, minúsculas, un número y un caracter especial (!@#$%&*)
    // Validamos la contraseña
    // const pattern = /^[a-zA-Z0-9!@#$%&*]{8,50}$/;
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
        'La contraseña debe tener al menos 8 caracteres y contener un número, una minúscula, una mayúscula y un caracter especial(!@#$%&*)', 400
      );
    }

    // Comprobamos que el passCode es el correcto en nuestra BBDD
    const checkRecPassCode = await checkRecoverPasswordQuery(recoverPassCode);   
    
    const idUser = checkRecPassCode.id;  

    //Actualizamos la contraseña del usuario
    await updateUserPasswordQuery(newPassword, idUser);

    res.send({
      status: "Ok",
      message: "Contraseña actualizada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = recoverPassword;
