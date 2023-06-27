const selectFamilyById = require("../../assets/queries/selectFamiliyById");
const selectFamilyByLineage = require("../../assets/queries/selectFamiliyByLineage");
const fs = require("fs");
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

    // Comprobamos que no existe un fichero que se llame igual
    lineageToChangePdf.pdf.map((file) => {
      // console.log(file + " = " + uploadPDF.name);
      if(file.toLowerCase() === uploadPDF.name.toLowerCase()) {
        throw generateError(`Ya existe un pdf con el mismo nombre en la familia ${lineage}`, 403);
      }
    })
    
    // Modificamos el json para guardar el nuevo pdf
    let jsonData = JSON.stringify(lineageToChangePdf);
    fs.writeFile('path', jsonData, (error) => {
      if(error) {
        throw generateError("Ha habido un problema a la hora de guardar el pdf. Inténtelo de nuevo.", 403)
      }
    })


    // Al comprobar que no existe pdf, lo guardamos
    for (const newPDF of Object.values(uploadPDF).slice(0,1)) {
      // Sacamos los metadatos del fichero que vamos a subir (name, size, mimetype, etc)
      console.log("newPDF: ", newPDF);
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