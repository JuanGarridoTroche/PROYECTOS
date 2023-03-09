const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const joi = require("@hapi/joi");
const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, birthday, firstName, lastName, dni } =
      req.body;

    // Comprobamos que los datos de username, email y password existen
    if (!username || !email || !password) {
      throw generateError(
        "Los campos de nombre de usuario, email y contraseña son obligatorios",
        400
      );
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

    // Comprobamos que no existe ese email en nuestra BBDD registrado.
    const user = await selectUserByEmailQuery(email);

    // Si existe el correo, generamos un error
    if (user) {
      throw generateError(
        "El correo electrónico ya está registrado, por favor, elige otro correo",
        403
      );
    }

    //Validamos el nombre de usuario
    const schemaUserName = joi
      .string()
      .min(4)
      .max(100)
      .required()
      .error(
        new Error(
          "Introduzca un nombre de usuario válido de al menos 4 caracteres",
          400
        )
      );
    const validationUserName = schemaUserName.validate(username);

    if (validationUserName.error || validationUserName === null) {
      throw generateError(validationUserName.error.message);
    }

    //Validamos la contraseña
    const schemaPwd = joi
      .string()
      .min(8)
      .max(100)
      .required()
      .error(new Error("La contraseña debe tener al menos 8 caracteres", 403));
    const validationPwd = schemaPwd.validate(password);

    if (validationPwd.error || validationPwd === null) {
      throw generateError(validationPwd.error.message);
    }

    // Comprobamos que no existen en BBDD username y email y si es así, creamos el uaurio
    await insertUserQuery(username, email, password, birthday, firstName, lastName, dni);


    res.send({
      status: "ok",
      message: "Usuario creado con éxito",      
    });
  } catch (err) {
    next(err);
  }
};

module.exports = registerUser;
