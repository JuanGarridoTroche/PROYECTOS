const data = require("../../assets/lineages.json")

const showLineage = async (req, res, next)=> {
    console.log("Entré en showLineage");
    try {
      // Mostrar los nombres de todas las familias
      const {lineage} = req.user;
      console.log(lineage);
      const {familyName} = req.params;
      console.log(familyName);

      res.send({
          status: "Ok",
          message: `Muestra el pdf de la familia ${familyName}`,
      })
    } catch (err) {
        next(err)
    }

}

module.exports = showLineage;