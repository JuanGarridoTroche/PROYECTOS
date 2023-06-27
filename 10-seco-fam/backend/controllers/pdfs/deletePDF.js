const selectFamilyById = require("../../assets/queries/selectFamiliyById");
const selectFamilyByLineage = require("../../assets/queries/selectFamiliyByLineage");
const { generateError, removePDF } = require("../../helpers");
const fs = require("fs");

const deletePDF = async(req, res, next) => {
  const {pdf, lineage} = req.body;
  const {id} = req.user;

  try {

    // Comprobamos que los 2 datos nos llegan
    if(!pdf || !lineage) {
      throw generateError("Faltan datos para poder eliminar el ficvhero", 403);
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
    
    // Comprobamos que existe un fichero que se llame igual al que nos piden eliminar
    const existsPdf = lineageToChangePdf.pdf.find((file) => file.toLowerCase() === pdf.toLowerCase())

    if(!existsPdf) {
      throw generateError(`No existe un pdf con el nombre ${pdf} en la familia ${lineage}`, 403);
    }


    // Hacemos copia del JSON original
    const json = fs.readFileSync('./assets/lineages.json', (error) => {
      if(error) {
        throw generateError("No se han podido leer los datos. Inténtalo de nuevo", 409)
      }
    })

    let jsonCopy = JSON.parse(json);
    let newArrayPdfs = [];
    jsonCopy.map((family) => {
      if(family.lineage === lineage) {
        family.pdf.map((item) => {
          if(item !== pdf) {
            newArrayPdfs.push(item);
          }
        });
        family.pdf = newArrayPdfs;
      }
    })

   const jsonWithoutPdf = JSON.stringify(jsonCopy);
   fs.writeFile('./assets/lineages.json', jsonWithoutPdf, (error) => {
    if(error) {
      throw generateError("Ha habido un error al eliminar el fichero. Inténtelo pasados unos minutos.", 409)
    }
   })

   // Eliminamos el fichero físicamente
    await removePDF(lineageToChangePdf, pdf)

    res.send({
      status: "Ok",
      message: "Fichero eliminado",
    })
  } catch (err) {
    next(err);
  }
}

module.exports = deletePDF;