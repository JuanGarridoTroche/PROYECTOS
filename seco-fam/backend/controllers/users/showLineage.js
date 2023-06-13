const data = require("../../assets/lineages.json");
const { generateError } = require("../../helpers");

const showLineage = async (req, res, next)=> {    
    try {
      // Mostrar los nombres de todas las familias
      const {lineage} = req.user;
      const {url} = req.params;
      let familyName ="";
      let familyPdf = "";
      
      // Buscamos en lineage.json (data) la url para quedartnos con el lineage
      for(let family of data) {
        if(family.url === url) {
          familyName = family.lineage;
          familyPdf = family.pdf;
        }
      }

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