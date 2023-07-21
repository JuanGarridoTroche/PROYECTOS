const { handleError } = require('../../helpers');
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
