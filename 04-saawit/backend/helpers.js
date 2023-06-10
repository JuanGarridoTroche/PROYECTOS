"use strict";
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const nodemailer = require('nodemailer');
const { v4: uuid } = require("uuid");
const { UPLOADS_DIR, SIB_SMTP_USER, SIB_SMTP_PASS } = process.env;

/* *
 * #################################################################
 * ##  Configuración de transporte de nuestro correo electrónico  ##
 * #################################################################
 */
const transport = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
      user: SIB_SMTP_USER,
      pass: SIB_SMTP_PASS,
  },
});


/* *
 * ######################
 * ##  Generate Error  ##
 * ######################
 */

const generateError = (msg, status) => {
  const err = new Error(msg);
  err.statusCode = status;
  return err;
};

/* *
 * ##################
 * ##  Save photo  ##
 * ##################
 */

const savePhoto = async (img, imgType = 0) => {
  const uploadsPath = path.join(__dirname, UPLOADS_DIR);
  
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath);
  }
  // Creamos un objeto sharp a partir de la imagen que quiere subir el usuario.
  const sharpImg = sharp(img.data);

  // Comprobamos si es foto de perfil o de una noticia
  if (!imgType) {
    // Redimensionamos a 200px
    sharpImg.resize(200);
  } else {
    // Si no, redimensionamos a 600px
    sharpImg.resize(600);
  }

  // Generamos un nuevo nombre a la imagen
  const imgName = `${uuid()}.jpg`;

  // Sacamos la ruta completa de la imagen
  const imgPath = path.join(uploadsPath, imgName);

  // Guardamos la imagen en la carpeta uploads
  await sharpImg.toFile(imgPath);

  // Devolvemos el nombre creado para la imagen
  return imgName;
};

/* *
 * ####################
 * ##  Delete photo  ##
 * ####################
 */
const deletePhoto = async (imgName) => {
  try {
    // Creamos la ruta de la imagen
    const photoPath = path.join(__dirname, UPLOADS_DIR, imgName);
    
    try {
      // Intentamos acceder a la foto
      await fs.access(photoPath);
    } catch {
      // Si no es posible acceder a la foto, el método fs.access(photoPath) lanza un error y lo devolvemos al catch anterior
      return;
    }
    // Si la imagen existe, la eliminamos
    await fs.unlink(photoPath);
  } catch {
    throw generateError(`Error al eliminar la foto de perfil actual ${imgName}`, 401);
  }
};

/* 
 * ###############
 * ## Send Mail ##
 * ###############
 */

const sendMail = async (to, subject, text) => {
  const mailOptions = {
      from: SIB_SMTP_USER,
      to,
      subject,
      text,
  };

  await transport.sendMail(mailOptions);
};


module.exports = {
  generateError,
  savePhoto,
  deletePhoto,
  sendMail,
};
