const selectFamilyById = require("../../assets/queries/selectFamiliyById");
const { generateError, savePDF } = require("../../helpers");

const sendPDF = async (req, res, next) => {
  
  try {   
    // Comprobamos que existe un fihero para subir
    if(!req.files) {
      throw generateError("No existe ningún fichero para subir", 404);
    } 

    console.log(req.files.pdf);
    // Comprobamos que es un fichero pdf
    if(req.files.pdf.mimetype !== 'application/pdf') {
      throw generateError("El fichero debe ser un fichero pdf válido", 403)
    }

    // Sacamos los datos del usuario logueado:
    const user = await selectFamilyById(req.user.id);

    // Comprobamos que el usuario es administrador:
    if(user.role !== 'admin') {
      throw generateError("El usuario no tiene permisos para realizar esta acción", 403);
    }

    // Al comprobar que existe pdf, lo guardamos
    for (const pdf of Object.values(req.files).slice(0,1)) {
      // Sacamos los metadatos del fichero que vamos a subir (name, size, mimetype, etc)
      const pdfName = await savePDF(pdf);

      console.log(pdfName);
    }
    

    
    res.send({
      status: "Ok",
      message: `subir PDF: ${req.files.pdf.name}`,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = sendPDF;