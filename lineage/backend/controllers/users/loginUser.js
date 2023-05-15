const joi = require("@hapi/joi");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const { generateError } = require("../../helpers");
const updateInvalidLoginUserQuery = require("../../queries/users/updateInvalidLoginUserQuery");
const updateDeactivateUserQuery = require("../../queries/users/updateDeactivateUserQuery");
const updateLoginUserTriesQuery = require("../../queries/users/updateLoginUserTriesQuery");


const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    console.log(email, password);

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
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword && user.tries < 3) {      
      updateInvalidLoginUserQuery(user.id, user.tries + 1);
      const tryLogin = (2 - user.tries);      
      throw generateError(user.tries === 1 ? `Credenciales incorrectas. Te queda ${tryLogin} intento de login` : `Credenciales incorrectas. Te quedan ${tryLogin} intentos de login`)      
    }
    if(user.tries === 3 && user.active) {
      updateDeactivateUserQuery(user.id);
      throw generateError("Credenciales incorrectas. Se ha desactivado la cuenta.")
    }

    // Si user.tries distinto de cero, actualizamos los intentos de login a cero
    if(user.tries){
      await updateLoginUserTriesQuery(user.id);
    }
    
    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      role: user.role,
      email: user.email,
      active: user.active,
    }

    // Creamos el token
    const tokenLng = jwt.sign(tokenInfo, process.env.SECRET, { algorithm: 'HS512', expiresIn: '7d'});

    
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
