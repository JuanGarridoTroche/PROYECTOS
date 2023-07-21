const nodemailer = require('nodemailer');
const Joi = require('joi');
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


/*
 * ########################
 * ## Validar contraseña ##
 * ########################
 */

const validatePassword = async(newPassword)=> { 

  // Comprueba que no haya espacios en blanco en los extremos de la cadena de la contraseña nueva
  if(newPassword.length !== newPassword.trim().length) {
    throw handleError("La contraseña no puede comenzar ni terminar con espacios", 403)
  }
  
  // Validamos la nueva contraseña que debe tener entre 8 y 25 caracteres, al menos un caracter en minúscula, mayúscula, un número y un caracter especial
  const myPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!¡¿?*])/;

  /*
  Desglose de la expresión regular:
    ^:            Asegura que la coincidencia comienza al inicio de la cadena.
    (?=.*[a-z]):  Es un lookahead positivo que verifica la presencia de al menos una letra minúscula.
    (?=.*[A-Z]):  Es otro lookahead positivo que verifica la presencia de al menos una letra mayúscula.
    (?=.*\d):     Este lookahead positivo verifica la presencia de al menos un dígito (número).
    (?=.*[@#$%^&+=!¡¿?*]): Este lookahead positivo verifica la presencia de al menos un carácter especial. Puedes agregar más caracteres especiales dentro de los corchetes si lo deseas.
    [A-Za-z\d@#$%^&+=!¡¿?*]{8,25}: Esto busca de 8 a 25 caracteres que pueden ser letras (mayúsculas o minúsculas), dígitos o los caracteres especiales especificados. Como ya validamos el mínimo y máximo de caracteres con Joi, no hace falta añadir esta línea.
    $:            Asegura que la coincidencia termine al final de la cadena.

  */

  const pwdSchema = Joi.string().min(8).max(25).pattern(myPattern).required();
  const pwdValidation = pwdSchema.validate(newPassword);

  if (pwdValidation.error || pwdValidation === null) {
    throw handleError(
      'La contraseña debe tener al menos 8 caracteres y contener un número, una minúscula, una mayúscula y un caracter especial',
      403
    );
  }

}

module.exports = { handleError, sendMail, validatePassword };
