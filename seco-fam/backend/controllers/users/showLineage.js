const data = require("../../assets/lineages.json");
const { generateError } = require("../../helpers");

const showLineage = async (req, res, next)=> {    
    try {
      // Mostrar los nombres de todas las familias
      const {lineage} = req.user;
      console.log("req.user (token): ", lineage);
      const {url} = req.params;      
      console.log("url: ", url);
      let familyName = "";

      // Buscamos en lineage.json (data) la url para quedartnos con el lineage
      for(let family of data) {
        console.log("Family.url: ", family.url);
        if(family.url === url) {
          familyName = family.lineage 
          console.log(familyName);      
        }
      }

    if(lineage !== familyName) {
      throw generateError("No tienes acceso a esta página", 403);
    }

      res.send({
          status: "Ok",
          message: `Muestra el pdf de la familia ${familyName}`, 
          data: familyName,         
      })
    } catch (err) {
        next(err)
    }

}

module.exports = showLineage;