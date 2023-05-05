const joi = require("@hapi/joi");
const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery')

const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    // Validamos el correo electrónico
    const emailSchema = joi.string().email().required()
    
    const emailValidation = emailSchema.validate(email);

    if(emailValidation.error || emailValidation === null) {
      throw generateError("Introduzca una cuenta de correo válida", 400)
    }

    // Comprobamos que existe el usuario por medio del email en nuestra BBDD
    const user = await selectUserByEmailQuery(email)
    
    res.send({

      status: "Ok",
      message: "Login realizado con éxito"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = loginUser;