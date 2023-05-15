const joi = require('@hapi/joi');
const { v4: uuid } = require('uuid');
const { generateError, sendMail } = require('../../helpers');
const insertUserQuery = require('../../queries/users/insertUserQuery')

const registerUser = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name1, last_name2 } = req.body;
    
    // Validamos el correo electrónico
    const emailSchema = joi.string().email().required();
    const emailValidation = emailSchema.validate(email);
    if (emailValidation.error || emailValidation === null) {
      throw generateError('Correo electrónico no válido', 403);
    }

    // Validamos el nombre de usuario y apellidos
    const namesSchema = joi.string().min(1).required();
    const first_nameValidation = namesSchema.validate(first_name);
    const last_name1Validation = namesSchema.validate(last_name1);
    const last_name2Validation = namesSchema.validate(last_name2);

    if (
      first_nameValidation.error ||
      first_nameValidation === null ||
      last_name1Validation.error ||
      last_name1Validation === null ||
      last_name2Validation.error ||
      last_name2Validation === null
    )
      throw generateError('Nombre y apellidos deben ser cubiertos', 403);

    // Validamos la contraseña
    // const pattern = /^[a-zA-Z0-9!@#$%&*]{8,50}$/;
    const myPwd = password.split('');
    const specCharPattern = /^[_!@#$%&*]{1,47}$/;
    const lcPattern = /^[a-z]{1,47}$/;
    const ucPattern = /^[A-Z]{1,47}$/;

    const pwdSchema = joi
      .array()
      .items(
        joi.string().required().regex(specCharPattern),
        joi.string().required().regex(lcPattern),
        joi.string().required().regex(ucPattern),
        joi.number().required()
      )
      .min(8)
      .max(50);
    
    const pwdValidation = pwdSchema.validate(myPwd);

    if (pwdValidation.error || pwdValidation === null) {
      throw generateError(
        'La contraseña debe tener al menos 8 caracteres y contener un número, una minúscula, una mayúscula y un caracter especial(!@#$%&*)', 400
      );
    }

     // Generamos un código de registro.
     const registrationCode = uuid();

    // Comprobar que la cuenta de correo no esté registrada ya en nuestra BBDD. Si no existe insertamos el usuario.
    await insertUserQuery({email, password, first_name, last_name1, last_name2, registrationCode})

    // Enviamos un correo para que active la cuenta
    // Creamos el asunto del email de verificación.
    const subject = "Activa tu usuario en Lineage";

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
    <h2>¡Bienvenid@ ${first_name} ${last_name1} ${last_name2}!</h2>
    <div style="background-color:grey; border-radius:10px">
      <p>Por favor, Activa tu cuenta de usuario a través del siguiente enlace:</p> 
      <a href="http://${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/users/register/validate/${registrationCode}">${registrationCode}</a>
    </div>
    `;

    // Enviamos un email de verificación al usuario.
    await sendMail(email, subject, emailContent);

    res.send({
      status: 'Ok',
      message: 'Usuario creado',
      body: {
        email,
        first_name,
        last_name1,
        last_name2,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = registerUser;
