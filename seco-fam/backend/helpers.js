const path = require("path");
const nodemailer = require("nodemailer");
const {SIB_SMTP_PASS, SIB_SMTP_USER} = process.env;

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


const uploadFile = async (pdf) => {
  const uploadsPath = path.access(uploadsPath);
};




module.exports = {generateError, sendMail};