const data = require("../../assets/lineages.json");
const { generateError } = require("../../helpers");

const showLineage = async (req, res, next)=> {    
    try {
      // Recogemos el nombre de la familia a través del token del usuario logueado
      const {lineage} = req.user;

      // Recogemos la url a través de sus params
      const {url} = req.params;
      let familyName ="";
      let familyPdf = [];
      
      // Buscamos en lineage.json (data) la urlextraida de params para quedarnos con el lineage
      for(let family of data) {
        if(family.url === url) {
          familyName = family.lineage;
          familyPdf = family.pdf;
        }
      }

      // Validamos que el lineage extraido de su token es igual al nombre de la familia sacado a partir de la url
      if(lineage !== familyName) {
        throw generateError("No tienes acceso a esta página", 403);
      }
      

      res.send({
          status: "Ok",
          message: `Muestra el pdf de la familia ${familyName}`, 
          data: {
            lineage: familyName,
            pdf: familyPdf
          },         
      })
    } catch (err) {
        next(err)
    }

}

module.exports = showLineage;