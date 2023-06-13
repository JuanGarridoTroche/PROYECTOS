const selectFamilyById = require("../../assets/queries/selectFamiliyById");
const selectFamilyByLineage = require("../../assets/queries/selectFamiliyByLineage");
const { generateError, savePDF } = require("../../helpers");

const sendPDF = async (req, res, next) => {
  const {lineage} = req.body;

  console.log(req.body);
  try {   
    // Comprobamos que existe el nombre de la familia donde vamosa subir el pdf
    if(!lineage) {
      throw generateError("Debes indicar a que familia quieres subir el pdf", 400);
    }
    console.log(req.files);

    // Comprobamos que existe un fichero para subir
    if(!req.files) {
      throw generateError("Debes adjuntar un fichero en formato pdf para subir", 404);
    } 

    // console.log(req.files.pdf);
    // Comprobamos que es un fichero pdf
    if(req.files.uploadPDF.mimetype !== 'application/pdf') {
      throw generateError("El fichero adjunto no es un fichero pdf válido", 403)
    }

    // Sacamos los datos del usuario logueado:
    const user = await selectFamilyById(req.user.id);

    // Comprobamos que el usuario es administrador:
    if(user.role !== 'admin') {
      throw generateError("El usuario no tiene permisos para realizar esta acción", 403);
    }

    // Sacamos los datos de la familia donde se va a sustituir el pdf:
    const lineageToChangePdf = await selectFamilyByLineage(lineage);

    // Al comprobar que existe pdf, lo guardamos
    for (const pdfMetadata of Object.values(req.files).slice(0,1)) {
      // Sacamos los metadatos del fichero que vamos a subir (name, size, mimetype, etc)
      console.log("pdfMetadata: ", pdfMetadata);
      const pdfName = await savePDF(pdfMetadata, lineageToChangePdf.pdf);

      console.log(pdfName);
    }
    

    
    res.send({
      status: "Ok",
      message: `PDF subido: ${req.files.pdf.name}`,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = sendPDF;