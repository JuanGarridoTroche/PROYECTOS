const { generateError, sendMail } = require("../../helpers");
const { v4: uuid } = require('uuid');
const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");
const updateRegistrationCodeQuery = require("../../queries/users/updateRegistrationCodeQuery");


const updateActivationSolicitude = async(req, res, next)=> {
  try {
    const {email} = req.body;
    
    // Comprobar que el email enviado tiene la cuenta desactivada
    const user = await selectUserByEmailQuery(email);
    
    if(user.active) throw generateError("La cuenta está activa", 400)
    
    // Generamos registrationCode
    const registrationCode = uuid();

    // Actualizamos el registrationCode en la BBDD
    await updateRegistrationCodeQuery(user.id, registrationCode);

    // Enviamos un correo para que active la cuenta
    // Creamos el asunto del email de verificación.
    const subject = "Activa tu usuario en Lineage";

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
    ¡Hola ${user.first_name} ${user.last_name1} ${user.last_name2}!

    Por favor, Activa tu cuenta de usuario a través del siguiente enlace: 
    <a href="http://${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/register/validate/${registrationCode}">${registrationCode}</a>
    `;

    // Enviamos un email de verificación al usuario.
    await sendMail(email, subject, emailContent);



    res.send({
      status: "Ok",
      message: "Enviada petición a su correo para activar la cuenta"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = updateActivationSolicitude;