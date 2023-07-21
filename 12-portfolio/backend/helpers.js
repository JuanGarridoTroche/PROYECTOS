const nodemailer = require('nodemailer');
require('dotenv').config();
const { BREVO_SMTP_USER, BREVO_SMTP_PASS } = process.env;

/*
 * #################################
 * ## MANEJAR ERROR EN EL BACKEND ##
 * #################################
 */
const handleError = (msg, status) => {
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
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_PASS,
  },
});

/*
 * ###############
 * ## Send Mail ##
 * ###############
 */
const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: BREVO_SMTP_USER,
    to,
    subject,
    text,
  };

  await transport.sendMail(mailOptions);
};

module.exports = { handleError, sendMail };
