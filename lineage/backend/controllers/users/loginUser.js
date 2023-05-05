const joi = require("@hapi/joi");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const { generateError } = require("../../helpers");


const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    //Comprobar que han introducido email y contraseña
    if (!email || !password) {
      throw generateError("Faltan campos", 400);
    }

    // Validamos el correo electrónico
    const emailSchema = joi.string().email().required()
    
    const emailValidation = emailSchema.validate(email);

    if(emailValidation.error || emailValidation === null) {
      throw generateError("credenciales incorrectas", 400)
    }

    // Comprobamos que existe el usuario por medio del email en nuestra BBDD
    const user = await selectUserByEmailQuery(email);

    // Comprobamos que el usuario está activo
    if(!user.active) {
      throw generateError("El usuario no está activo", 401);
    }

    // Comprobamos que la contraseña es válida
    await bcrypt.compare(password, user.password, (err, ok) => {
      if(err) throw generateError(err.message, 401);
      if(!ok) throw generateError("Credenciales incorrectas pwd")
    })

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      role: user.role,
      email: user.email,
      active: user.active,
    }

    // Creamos el token
    const tokenLng = jwt.sign(tokenInfo, process.env.SECRET, { algorithm: 'HS256', expiresIn: '7d'});
    
    res.send({
      status: "Ok",
      message: "Login realizado con éxito",
      data: {
        tokenLng,
      }
    })
  } catch (err) {
    next(err);
  }
}

module.exports = loginUser;
