const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const { v4: uuid } = require("uuid");

const { generateError, sendMail } = require("../../helpers");

const newUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw generateError("Faltan campos", 400);
    }

    // Generamos un código de registro.
    const registrationCode = uuid();

    // Insertamos el usuario en la base de datos.
    await insertUserQuery(username, email, password, registrationCode);

    // Creamos el asunto del email de verificación.
    const subject = "Activa tu usuario en Diario de Viajes";

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `

            ¡Bienvenid@ ${username}!

            Por favor, verifica tu usuario a través del siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/validate/${registrationCode}">Verificar</a>
        `;

    // Enviamos un email de verificación al usuario.
    await sendMail(email, subject, emailContent);

    res.send({
      status: "ok",
      message:
        "Usuario creado. Por favor, verifique su identidad a través del email que recibirá en su correo electrónico",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
