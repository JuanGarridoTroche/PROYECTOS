const { handleError, validatePassword } = require("../../helpers");
const bcrypt = require('bcrypt');
const selectUserByPasscodeQuery = require("../../queries/users/selectUserByPasscodeQuery");
const updatePassword = require("./updatePassword");
const updatePasswordUserQuery = require("../../queries/users/updatePasswordUserQuery");
const updateRecoverPassCodeQuery = require("../../queries/users/updateRecoverPassCodeQuery");

const updatePasswordWithPassCode = async(req, res, next) => {
  const {passcode, newPassword} = req.body
  try {

    // Commprobamos que ambos campos traen info
    if(!passcode || !newPassword) {
      throw handleError("Cumplimente todos los cmapos", 403)
    }

    // Buscamos el usuario por medio del passcode
    const user = await selectUserByPasscodeQuery(passcode)
    if(!user) {
      // console.log("el passcode ya se ha utilizado y/o no existe");
      throw handleError("El passcode no existe", 403)
    }

    console.log(user);

    // Validamos contraseña
    await validatePassword(newPassword);

    // Hasheamos la contraseña
    const hashPass = await bcrypt.hash(newPassword, 10);

    // Actualizamos en el registro la contraseña y eliminamos el passcode
    await updatePasswordUserQuery(hashPass, user.id);

    // Eliminamos el passcode de la BBDD
    const recoverPasscode=null;
    await updateRecoverPassCodeQuery(recoverPasscode, user.id)

    res.send({
      status: "Ok",
      message: `Nueva contraseña: '${newPassword}'`
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = updatePasswordWithPassCode;