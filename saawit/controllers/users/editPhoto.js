"use strict";

const { generateError, savePhoto, deletePhoto } = require("../../helpers");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const editPhoto = async (req, res, next) => {
  try {
    //Comprobar que existe una foto para subir/modificar
    if (!req.files?.photo) {
      throw generateError("Falta añadir una foto de perfil", 400);
    }

    //Comprobamos si tiene foto anterior
    const user = await selectUserByIdQuery(req.user.id);

    //Subimos/modificamos la imagen de perfil
    const photo = await savePhoto(req.files.photo);

    // Si tiene foto, la eliminamos   
    if (user.photo) {
      await deletePhoto(user.photo);
    }

    //Actualizamos el registro con el nuevo nombre de la foto de perfil.
    const updateUserPhotoQuery = require("../../bbdd/queries/users/updateUserPhotoQuery");
    await updateUserPhotoQuery(photo, req.user.id);
    res.send({
      status: "Ok",
      message: "Usuario actualizado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editPhoto;
