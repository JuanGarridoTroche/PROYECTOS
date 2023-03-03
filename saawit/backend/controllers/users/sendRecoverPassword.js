'use strict'
const joi = require("@hapi/joi");
const randomstring = require('randomstring');

const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const updateRecoverPassQuery = require('../../bbdd/queries/users/updateRecoverPassQuery');
const { generateError, sendMail } = require("../../helpers");

const sendRecoverPassword = async (req, res, next) => {

  try {
    const {email} = req.body;

    // Comprobamos que nos hayan enviado un correo electrónico válido
    // Para ello vamos a utilizar la dependecia de validadción de datos joi
    const schema =  joi.string().email().required().error(new Error("Introduzca una cuenta de correo válida"));
    const validation = schema.validate(email);

    if (validation.error || validation === null) {
      throw generateError(validation.error.message);
    } 

    // Comprobamos que existe ese usuario en nuestra BBDD registrado.
    const verifyEmail = await selectUserByEmailQuery(email);

    if (!verifyEmail) {
      throw generateError("Email incorrecto", 404);
    }

    // Generamos el código de recuperación con la dependencia randomstring
    const recoverPassCode = randomstring.generate(16);

    // Insertamos el código de recuperación en la BBDD
    await updateRecoverPassQuery(recoverPassCode, email);

    // Creamos el correo electrónico para enviar al usuario
    const subject = 'Recuperación de contraseña de tu usuario en saawit';

    const emailContent = `Hola ${verifyEmail.username},
    
    Se ha solicitado la recuperación de la contraseña para este email en SAAWIT. Utiliza el siguiente código para crear una nueva contraseña: <a href="http://localhost:3000/users/password/recover" alt="recover">${recoverPassCode}</a>

    Si no has sido tú, ignora este correo.`;


    // Enviar un email con el código de recuperación
    await sendMail(email, subject, emailContent);

    
    res.send({
      status: 'Ok',
      message:`Email de recuperación de contraseña enviado a ${email}.`,
    })
  } catch (err) {
    next(err);
  }

}

module.exports = sendRecoverPassword;