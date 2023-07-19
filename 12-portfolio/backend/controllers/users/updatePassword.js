const { handleError } = require('../../helpers');
const Joi = require('joi');

const updatePassword = async (req, res, next) => {
  let { password } = req.body;
  const { id, email } = req.user;
  try {
    // Validamos la contraseña, debe tener entre 8 y 20 caracteres, al menos un caracter en minúscula, mayúscula, un número y un caracter especial
    const regExp = /^(?=.[a-z]+)(?=.[A-Z]+)(?=.\d+)(?=.*[$@$!%*?&])(^[A-Za-z\d$@$!%*?&]+$){8,20}$/; // no admite espacios en blanco   
    const coincide = /(?=.[a-z]+)/ig;
    
    console.log("Solución: ", password.match(coincide)[0]);
    
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])(^[A-Za-z\d$@$!%*?&]+$){8,20}$/; // no admite espacios en blanco   

    
    const pwdSchema = Joi.string().min(8).max(20);


    res.send({
      status: 'Ok',
      message: 'Contraseña actualizada',
      body: "",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updatePassword;
