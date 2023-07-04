const selectFamilyById = require("../../assets/queries/selectFamiliyById");
const selectFamilyByLineage = require("../../assets/queries/selectFamiliyByLineage");
const { generateError, savePDF } = require("../../helpers");

const createPDF = async (req, res, next) => {
  const {uploadPDF} = req.files;
  const {lineage} = req.body;
  const {id} = req.user;

  try {   
    // Comprobamos que existe un nombre de familia en el select, donde vamos a subir el pdf
    if(!lineage) {
      throw generateError("Debes indicar a que familia quieres subir el pdf", 400);
    }    
    
    // Comprobamos que existe un fichero para subir
    if(!req.files) {
      throw generateError("Debes adjuntar un fichero en formato pdf para subir", 404);
    } 
    
    // Comprobamos que es un fichero pdf
    if(uploadPDF.mimetype !== 'application/pdf') {
      throw generateError("El fichero adjunto no es un fichero pdf válido", 403)
    }
    
    // Sacamos los datos del usuario logueado:
    const user = await selectFamilyById(id);
    
    // Comprobamos que el usuario es administrador:
    if(user.role !== 'admin') {
      throw generateError("El usuario no tiene permisos para realizar esta acción", 403);
    }
    
    // Sacamos los datos de la familia donde se va a sustituir el pdf:
    const lineageToChangePdf = await selectFamilyByLineage(lineage);
    
    // Comprobamos que existe el lineage en nuestro json
    if(!lineageToChangePdf) throw generateError("No existe ese nombre de familia", 403);

    // Confirmamos que existe el pdf que vamos a sustituir
    let existsPdf = false;
    lineageToChangePdf.pdf.map((myPdf) => {
      console.log(myPdf + " = " + uploadPDF.name);
      if(myPdf === uploadPDF.name) {
        existsPdf = true;
      }
    })

    if(!existsPdf) {
      throw generateError("El pdf que quieres actualizar no existe.", 403);
    }

    
    // Al comprobar que no existe pdf, lo guardamos físicamente
    for (const newPDF of Object.values(uploadPDF).slice(0,1)) {
      // Sacamos los metadatos del fichero que vamos a subir (name, size, mimetype, etc)     
      const pdfName = await savePDF(newPDF, lineageToChangePdf, uploadPDF);
    }    
    
    res.send({
      status: "Ok",
      message: `PDF subido`,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = createPDF;