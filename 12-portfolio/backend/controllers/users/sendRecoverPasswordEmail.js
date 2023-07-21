const { handleError, sendMail } = require('../../helpers');
const randomstring = require('randomstring');
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const updateRecoverPassCodeQuery = require('../../queries/users/updateRecoverPassCodeQuery');

const sendRecoverPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Comprobamos que el email está registrado en nuestra BBDD
    const user = await selectUserByEmailQuery(email);
    if (!user) {
      // console.log("El correo electrónico no está registrado en nuestra BBDD");
      throw handleError(
        'No se ha podido enviar el correo. Si el problema persiste, hable con el administrador',
        403
      );
    }

    // Generamos una clave de 16 caracteres para enviar al peticionario
    const recoverPassCode = randomstring.generate(16);

    // Insertamos la clave en la BBDD
    await updateRecoverPassCodeQuery(recoverPassCode, user.id);

    // Creamos el correo electrónico para enviar al usuario
    const subject = 'Recuperación de contraseña para Portfolio';
    const emailContent = `Hola ${user.firstName} ${user.lastName1} ${user.lastName2},
    
    Se ha solicitado la recuperación de la contraseña para este email en PORTFOLIO. Utiliza el siguiente código para crear una nueva contraseña: <a href="http://localhost:3000/user/password/recover" alt="recover">${recoverPassCode}</a>

    Si no has sido tú, ignora este correo.`;   

    // Enviamos el email
    await sendMail(email, subject, emailContent);

    res.send({
      status: 'Ok',
      message: `Código de recuperación de contraseña enviado a ${email}`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendRecoverPasswordEmail;
