const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const nodemailer = require('nodemailer');
const { v4: uuid } = require("uuid");
const { SIB_SMTP_USER, SIB_SMTP_PASS, UPLOADS_DIR } = process.env;

/*
 * ###################
 * ## GENERAR ERROR ##
 * ###################
 */

const generateError = (msg, status) => {
  const err = new Error(msg);
  err.statusCode = status;
  return err;
};

/* 
Generamos una función de control de errores en el que no le vamos a dar más info al usuario que el tipo (title) y referencia (número)
para que contacte con el administrador.
Ejemplo: 
{
  title: "Error de validación"
  ref: 234500912065
  statusCode: 403
  msg: "no es una cuenta de correo válida"
}

Así, cada referencia equivaldrá a un error concreto pero el usuario solo verá el title para no dar muchas pistas al user.
*/
const generateMyError = ({title, ref, msg, status}) => {
  
  const err = new Error(msg);
  err.title = title;
  err.ref = ref;
  err.statusCode = status;
  return err;
};

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

/*
 * ###############
 * ## Send Mail ##
 * ###############
 */

// Los valores recibidos se tienen que llamar to, subjet y text para que sendinblue los capture
const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: SIB_SMTP_USER,
    to,
    subject,
    text,
  };

  await transport.sendMail(mailOptions);
};





/*
* ################
* ## Save photo ##
* ################
*/

const savePhoto = async (img, imgType = 0) => {
  const uploadsPath = path.join(__dirname, UPLOADS_DIR)
  
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath);
  }
  
  // Creamos un objeto sharp a partir de la imagen que quiere subir el usuario
  const sharpImg = sharp(img.data);
  
  // Comprobamos si es foto de perfil o de un escudo
  if(!imgType) {
    // Redimensionamos a 200px, foto de perfil
    sharpImg.resize(200);
  } else {
    // Redimensionamos a 600px, foto de escudo
    sharpImg.resize(600)
  }

  // Generamos un nuevo nombre a la imagen
  const imgName = `${uuid()}.jpg`;
  
  // Sacamos la ruta completa de la imagen
  const imgPath = path.join(uploadsPath, imgName);
  
  // Guardamos la imagen en la carpeta assets
  await sharpImg.toFile(imgPath);
  
  // Devolvemos el nombre creado para la imagen
  return imgName;
}

module.exports = { generateError , sendMail, savePhoto, generateMyError};
