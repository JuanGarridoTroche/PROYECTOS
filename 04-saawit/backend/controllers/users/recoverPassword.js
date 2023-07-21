"use strict";

const { generateError } = require("../../helpers");
const checkRecoverPasswordQuery = require("../../bbdd/queries/users/checkRecoverPasswordQuery");
const updateUserPasswordQuery = require("../../bbdd/queries/users/updateUserPasswordQuery");

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

    // Comprobamos que el passcode es el correcto en nuestra BBDD
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
