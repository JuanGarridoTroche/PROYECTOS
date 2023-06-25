const {generateError} = require("../../helpers")

const updateJSON = async (req, res, next) => {
  let data=[];
  try {   
    
    if(req.files) {
      const {pdf} = req.files;
  
      if(!pdf.name || !pdf.data || pdf.mimetype !== 'application/pdf') {
        throw generateError("Introduzca un fichero pdf válido", 400)
      }

      data = [pdf];

    }
    
    
    
    res.send({
      status: "Ok",
      message: `datos subidos al json`, 
        data,  
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = updateJSON;