'use strict';
const joi = require('@hapi/joi');
const randomstring = require('randomstring');

const { generateError, sendMail } = require('../../helpers');
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const updateRecoverPassQuery = require('../../queries/users/updateRecoverPassQuery');

const sendRecoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Comprobamos que nos hayan enviado un correo electrónico válido
    // Para ello vamos a utilizar la dependecia de validadción de datos joi
    const schema = joi
      .string()
      .email()
      .required()
      .error(new Error('Introduzca una cuenta de correo válida'));
    const validation = schema.validate(email);

    if (validation.error || validation === null) {
      throw generateError(validation.error.message);
    }

    // Comprobamos que existe ese usuario en nuestra BBDD registrado.
    const verifyEmail = await selectUserByEmailQuery(email);

    if (!verifyEmail) {
      throw generateError('Email incorrecto', 404);
    }

    // Generamos el código de recuperación con la dependencia randomstring
    const recoverPassCode = randomstring.generate(16);

    // Insertamos el código de recuperación en la BBDD
    await updateRecoverPassQuery(recoverPassCode, email);

    // Creamos el correo electrónico para enviar al usuario
    const subject = 'Recuperación de contraseña de tu usuario en Lineage';

    const emailContent = `<h2>Hola ${verifyEmail.first_name},</h2>
    <div style="background-color:rgb(225, 218, 218); color:white; border-radius:10px; display:flex; flex-direction:column;justify-content:center;align-items:center; padding:'0 30px'">
      <img src="/assets/lineage-logo.png" style="border-radius:50%; width:50px; "/>
      <p style="padding-left:30px">Se ha solicitado la recuperación de la contraseña para este email en Lineage. Utiliza el siguiente código para crear una nueva contraseña:</p> 
      <a href="http://${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/users/password/recover/${recoverPassCode}" alt=${recoverPassCode} style="text-align:center; padding-bottom:30px">${recoverPassCode}</a>
      <p>Si no lo has solicitado, ignora este correo.</p>
    </div>
   `;

    // Enviar un email con el código de recuperación
    await sendMail(email, subject, emailContent);

    res.send({
      status: 'Ok',
      message: `Email de recuperación de contraseña enviado a ${email}.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendRecoverPassword;
