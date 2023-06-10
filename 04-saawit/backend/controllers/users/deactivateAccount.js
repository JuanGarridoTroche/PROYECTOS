"use strict";

const updateActiveUserQuery = require("../../bbdd/queries/users/updateActiveUserQuery");



const deactivateAccount = async (req, res, next) => {
  try {
    const { id: idUser } = req.user;

    // Seleccionamos los datos actuales del usuario
    const news = await updateActiveUserQuery(idUser);  


    res.send({
      status: "Ok",
      message: "perfil de usuario desactivado. Para activarlo, solicite la recuperación de contraseña a través de su cuenta de correo.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deactivateAccount;