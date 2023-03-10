const { generateError,sendMail } = require("../../helpers");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const joi = require("@hapi/joi");
const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");
const { v4: uuid } = require("uuid");

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
    // Para ello vamos a utilizar la dependecia de validación de datos joi
    const schemaEmail = joi
      .string()
      .email()
      .required()
      .error(new Error("Introduzca una cuenta de correo válida", 400));
    const validationEmail = schemaEmail.validate(email);

    if (validationEmail.error || validationEmail === null) {
      throw generateError(validationEmail.error.message);
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
      .min(3)
      .max(100)
      .required()
      .error(
        new Error(
          "Introduzca un nombre de usuario válido de al menos 3 caracteres",
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

    //Validamos el dni de usuario
    if(dni) {
    const schemaDni = joi
      .string()
      .length(9)
      .uppercase()
      .error(new Error("Introduzca un DNI válido", 400));
    const validationDni = schemaDni.validate(dni);

    if (validationDni.error || validationDni === null) {
      throw generateError(validationDni.error.message);
    }

    const validateDni = () => {
      const validLetters = [
        "T",
        "R",
        "W",
        "A",
        "G",
        "M",
        "Y",
        "F",
        "P",
        "D",
        "X",
        "B",
        "N",
        "J",
        "Z",
        "S",
        "Q",
        "V",
        "H",
        "L",
        "C",
        "K",
        "E",
      ];
      const checkNumbers = dni.slice(0, -1);
      const checkLetter = dni.toUpperCase().slice(8, 9);

      // Comprobamos que los 8 primeros caracteres son números y que el éultimo es una letra del array validLetters
      if (isNaN(checkNumbers) || !validLetters.find((e) => e === checkLetter)) {
        throw generateError("Introduzca un DNI válido", 400);
      }
      const validDni = [checkNumbers, checkLetter];

      //Calcular la letra del DNI y validarlo:
      validDni.push(validDni[0] % 23);
      if (validDni[1] !== validLetters[validDni[2]]) {
        throw generateError("Introduzca un DNI válido, letra inventada", 400);
      }
    };
    
    dni ? validateDni() : dni = null;

  }
    
    // Generamos un código de registro.
    const registrationCode = uuid();
    
    
    // Comprobamos que no existen en BBDD username y email y si es así, creamos el usuario
    await insertUserQuery(
      username,
      email,
      password,
      birthday,
      firstName,
      lastName,
      dni,
      registrationCode,
      );
      
    // Enviamos un correo para que active la cuenta
    // Creamos el asunto del email de verificación.
      const subject = "Activa tu usuario en Expenses account";

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
    ¡Bienvenid@ ${username}!

    Por favor, Activa tu usuario a través del siguiente enlace: 
    <a href="${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/user/register/validate/${registrationCode}">Verificar</a>
    `;

    // Enviamos un email de verificación al usuario.
    await sendMail(email, subject, emailContent);

    res.send({
      status: "ok",
      message: "Usuario creado con éxito. Para activar su cuenta siga las instrucciones del correo que le llegará en breve a su cuenta.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = registerUser;
