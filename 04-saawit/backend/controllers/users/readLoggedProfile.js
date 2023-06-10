"use strict";

const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const readProfile = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw generateError("El usuario no existe", 400);
    }
    // Seleccionamos los datos actuales del usuario
    const user = await selectUserByIdQuery(req.user.id);
    
    const {id, username, email, photo, role, active, createdAt} = user;
    
    res.send({
      status: "Ok",
      message: "perfil de usuario",
      data: {
        id, username, email, photo, role, active, createdAt,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readProfile;
