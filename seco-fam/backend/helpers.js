const nodemailer = require("nodemailer");
const path = require("path");
const {SIB_SMTP_PASS, SIB_SMTP_USER, UPLOADS_DIR, HOST, PORT} = process.env;

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


/* *
 * ################
 * ##  Save pdf  ##
 * ################
 */
const savePDF = async(pdf) => {
  const uploadsPath = path.join(__dirname, UPLOADS_DIR, "\\data");
  console.log("nombre del directorio: ", __dirname, "nombre del fichero: ", __filename);
  console.log(`${uploadsPath}`);
  console.log(`${HOST}:${PORT}/static/data`);
  return uploadsPath;
  try {
    
  } catch (err) {
    
  }

}


module.exports = {generateError, sendMail, savePDF};