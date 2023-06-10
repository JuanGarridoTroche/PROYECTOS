
const sendForm = async (req, res, next) => {
  
  try {   
   

    
    res.send({
      status: "Ok",
      message: `Formulario enviado con éxito`, 
      data: "",
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = sendForm;