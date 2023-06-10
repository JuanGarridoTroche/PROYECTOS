"use strict";

const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const { generateError } = require("../../helpers");

const readProfile = async (req, res, next) => {
  try {
    const { idUser } = req.params;

    // Seleccionamos los datos actuales del usuario
    const user = await selectUserByIdQuery(idUser);   
    
    const {id, username, email, bio, photo, role, active, createdAt} = user;


    res.send({
      status: "Ok",
      message: "perfil de usuario",
      data: {
        id, username, email, bio, photo, role, active, createdAt,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readProfile;
