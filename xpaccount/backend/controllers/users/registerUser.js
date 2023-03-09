const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, birthday, firstName, lastName, dni } = req.body;

    // Comprobamos que los datos de username, email y password existen
    if(!username || !email || !password) {
      throw generateError('Los campos de nombre de usuario, email y contraseña son obligatorios', 400);
    }

    // Validamos el correo electrónico
    // Para ello vamos a utilizar la dependecia de validadción de datos joi
    const schema = joi
      .string()
      .email()
      .required()
      .error(new Error("Introduzca una cuenta de correo válida", 400));
    const validation = schema.validate(email);

    if (validation.error || validation === null) {
      throw generateError(validation.error.message);
    }

    // Comprobamos que no existe ese usuario en nuestra BBDD registrado.
    const user = await selectUserByEmailQuery(email);   
    
    // Si existe el correo, generamos un error
    if (user.email) {
      throw generateError("El correo electrónico ya está registrado, por favor, elige otro correo", 403);
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
    const tokenIfo = {
      id: user.id,
      active:user.active,
      email: user.email,
    };

    // Creamos el token
    const token = jwt.sign(tokenIfo, process.env.SECRET);

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

module.exports = registerUser;
