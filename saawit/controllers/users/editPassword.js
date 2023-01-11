"use strict";

const { generateError } = require("../../helpers");
const updateUserPasswordQuery = require("../../bbdd/queries/users/updateUserPasswordQuery");
const checkPassword = require("../../controllers/users/checkPassword");

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
