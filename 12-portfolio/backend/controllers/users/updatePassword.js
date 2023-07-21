const { handleError, validatePassword } = require('../../helpers');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const checkPassword = require('./checkPassword');
const updatePasswordUserQuery = require('../../queries/users/updatePasswordUserQuery');

const updatePassword = async (req, res, next) => {
  let { password, newPassword } = req.body;
  const { id } = req.user;
  const { idUser } = req.params;

  try {
    // Comprobamos que el usuario logueado es el usuario del que vamos a solicitar los datos
    if (id !== Number(idUser)) {
      // console.log("Un usuario está intentando acceder a otro sin permiso");
      throw handleError('No tienes permisos para ver esta página', 403);
    }

    // Comprobamos que los campos estén cubiertos
    if (!password || !newPassword) {
      throw handleError('Debe cumplimentar todos los campos', 403);
    }
       
    // Validamos la contraseña
    await validatePassword(newPassword);

    // Comprobamos que la password original es la correcta
    await checkPassword(password, id);

    // Encriptamos la contraseña del usuario
    const hashPass = await bcrypt.hash(newPassword, 10);
    console.log(hashPass);

    // Procedemos a actualizar la contraseña en la BBDD
    await updatePasswordUserQuery(hashPass, id);

    res.send({
      status: 'Ok',
      message: 'Contraseña actualizada',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updatePassword;
