"use strict";

const selectUserByUsernameQuery = require("../../bbdd/queries/users/selectUserByUsernameQuery");
const selectMailByEmailQuery = require("../../bbdd/queries/users/selectMailByEmailQuery");
const updateProfileQuery = require("../../bbdd/queries/users/updateProfileQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const { deletePhoto, savePhoto } = require("../../helpers");

const editProfile = async (req, res, next) => {
  try {
    let { username, email, bio } = req.body;

    // Seleccionamos los datos actuales del usuario
    const user = await selectUserByIdQuery(req.user.id);

    // Si existe un nombre de usuario comprobamos que este disponible.
    if (username) await selectUserByUsernameQuery(username);

    // Si existe un email comprobamos que este disponible.
    if (email) await selectMailByEmailQuery(email);

    if (!username) username = user.username;
    if (!bio) bio = user.bio;
    if (!email) email = user.email;

    let photoName;

    // Comprobamos si existe avatar.
    if (req.files?.photo) {
      // Eliminamos el avatar viejo de la carpeta de subida de archivos (si existe).
      if (user.photo) await deletePhoto(user.photo);

      // Guardamos el nuevo avatar en la carpeta de uploades y obtenemos su nombre.
      photoName = await savePhoto(req.files.photo);
    }

    if (!photoName) photoName = user.photo;

    //Actualizamos los datos
    await updateProfileQuery(username, email, bio, photoName, req.user.id);

    res.send({
      status: "Ok",
      data: {
        username,
        bio,
        email,
        photo: photoName,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editProfile;
