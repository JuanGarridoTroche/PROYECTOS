"use strict";

const selectUserByUsernameQuery = require("../../bbdd/queries/users/selectUserByUsernameQuery");
const selectMailByEmailQuery = require("../../bbdd/queries/users/selectMailByEmailQuery");
const updateProfileQuery = require("../../bbdd/queries/users/updateProfileQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const editProfile = async (req, res, next) => {
  try {
    let { username, email, bio, active } = req.body;

    // Seleccionamos los datos actuales del usuario
    const user = await selectUserByIdQuery(req.user.id);

    // Comprobamos que username no esté registrado en la BBDD
    await selectUserByUsernameQuery(username);
    if(!username || username ==="") {
      username = user.username;
    }

    // Comprobamos que el email no esté ya registrado en la BBDD
    await selectMailByEmailQuery(email);
    if(!email) email = user.email;
    console.log(email);

    if(active !== true || active !== false) active =user.active;
    //Actualizamos los datos
    await updateProfileQuery(username, email, bio, active, req.user.id);

    res.send({
      status: "Ok",
      message: "perfil actualizado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editProfile;
