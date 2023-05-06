"use strict";

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

    // Comprobamos que la password es la correcta en nuestra BBDD
    const checkRecPassCode = await checkRecoverPasswordQuery(recoverPassCode);   
    console.log(checkRecPassCode);
    const idUser = checkRecPassCode.id;

    console.log(idUser);
    

    //Actualizamos la contraseña del usuario
    await updateUserPasswordQuery(newPassword, checkRecPassCode.id);

    res.send({
      status: "Ok",
      message: "Contraseña actualizada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = recoverPassword;
