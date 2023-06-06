const data = require("../../assets/lineages.json")

const showLineage = async (req, res, next)=> {
    try {
      // Mostrar los nobres de todas las familias

      res.send({
          status: "Ok",
          message: "Mostrar pdf de la familia",
      })
    } catch (err) {
        next(err)
    }

}

module.exports = showLineage;