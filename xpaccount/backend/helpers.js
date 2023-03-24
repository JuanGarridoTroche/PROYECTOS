const nodemailer = require('nodemailer');
const { SIB_SMTP_USER, SIB_SMTP_PASS } = process.env;

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
 * ######################
 * ##  Generate Error  ##
 * ######################
 */

const generateError = (message, status) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};



/* *
 * ############################################
 * ##  Convert Excel Santander Bank to JSON  ##
 * ############################################
 */
const xlsx = require("xlsx");
const excelSantanderToJSON = (excelFile) => {
  const excel = xlsx.readFile(`/${process.env.DIR_UPLOADS}/${excelFile}`);

  // Guardamos los nombres de las hojas de las que se compone nuestro excel en un array
  const sheetName = excel.SheetNames;

  let data = xlsx.utils.sheet_to_json(excel.Sheets[movimientos[0]], {
    cellDates: true
  })

  console.log(data);
}




module.exports = {
  generateError,
  sendMail,
  excelSantanderToJSON,
}