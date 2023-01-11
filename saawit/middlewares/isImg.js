"use strict";

const generateError = require("../helpers");

const isImg = async (req, res, next) => {
  try {
    // Comprobamos que la extensión del fichero que quiere subir el usuario es el correcto
    const typeImg = req.files.photo.mimetype.split('/').pop();
    const ValidExtensions = [
      "jpeg",
      "jpg",
      "bmp",
      "png",
      "raw",
      "gif",
      "webp",
      "jpe",
      "jfif",
    ];
        
    if (!ValidExtensions.includes(typeImg)) {
      throw generateError("La foto que pretendes subir no es una imagen válida", 401);
    }
    req.mimetype = req.files.photo.mimetype;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = isImg;
