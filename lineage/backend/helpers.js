const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const nodemailer = require('nodemailer');
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

module.exports = { generateError , sendMail};




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
}