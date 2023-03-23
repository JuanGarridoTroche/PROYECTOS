const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validamos el correo electrónico
    // Para ello vamos a utilizar la dependecia de validadción de datos joi
    const schemaEmail = joi
      .string()
      .email()
      .required()
      .error(new Error("Introduzca una cuenta de correo válida", 400));
    const validationEmail = schemaEmail.validate(email);

    if (validationEmail.error || validationEmail === null) {
      throw generateError(validationEmail.error.message);
    }

    // Comprobamos que existe ese usuario en nuestra BBDD registrado.
    const user = await selectUserByEmailQuery(email);    

    if (user.length < 1) {
      throw generateError("Email y/o contraseña inválidos", 404);
    }    

    //Comprobamos que el usuario está activo
    if (!user.active) {
      throw generateError("El usuario no está activo", 401);
    }

    //Comprobar que han introducido email y contraseña
    if (!email || !password) {
      throw generateError("Faltan campos", 400);
    }
  
    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Email y/o contraseña inválidos", 401);
    }

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      active:user.active,
      email: user.email,
    };
    
    // Creamos el token
    const token = jwt.sign(tokenInfo, process.env.SECRET);

    res.send({
      status: "ok",
      message: "Login realizado con éxito",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
