const joi = require("@hapi/joi");
const { generateError, sendMail } = require("../../helpers");
const sendForm = async (req, res, next) => {
  const {lineage} = req.user;
  console.log(lineage);
  const {name, text, subject} = req.body;
  const {HOST, PORT, SIB_SMTP_USER} = process.env;
  try { 

   // Validamos los datos insertados por el usuario
   const nameSchema = joi.string().required();
   const nameValidation = nameSchema.validate(name);
   if(nameValidation.error || !nameValidation) {
    throw generateError("Introduzca un nombre para continuar con la solicitud", 400);
   }

  //  Validamos el texto enviado
  const textSchema = joi.string().min(10).required();
  const textValidation = textSchema.validate(text);
  if(textValidation.error || !textValidation) {
    throw generateError("El texto debe contener al menos 10 caracteres", 400)
  }

  // Validamos el asunto del correo
  const subjectSchema = joi.string().min(3).required();  
  const subjectValidation = subjectSchema.validate(subject);
  if(subjectValidation.error || !subjectValidation) {
    throw generateError("El asunto debe contener al menos una palabra", 400)
  }

  // Al ser un formulario, vamos a enviar el correo siempre al mismo destinatario (administrator):
  const email = SIB_SMTP_USER;

  // Creamos el contenido del correo  
  const emailContent=`
    <h2>Correo desde la web de la familia Seco:</h2>
    <h5>Tienes un correo nuevo de ${name}, logueado desde la familia ${lineage}</h5>
    <div style="background-color:rgb(155, 155, 155); color:white; border-radius:10px; display:flex; flex-direction:column;justify-content:center;align-items:center">
      <img src="${HOST}:${PORT}/static/img/944.jpg" style="max-height:80px width:auto"/>
      <p style="padding-left:30px">${text}</p>      
    </div>
  `;

  //  Enviamos el correo electrónico
  // Enviamos un email de verificación al usuario.
  await sendMail(email, subject, emailContent);


    
    res.send({
      status: "Ok",
      message: `Formulario enviado con éxito`,
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = sendForm;