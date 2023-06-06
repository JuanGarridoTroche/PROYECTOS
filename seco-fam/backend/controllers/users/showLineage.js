
const showLineage = async (req, res, next)=> {
    try {

      res.send({
          status: "Ok",
          message: "Mostrar pdf de la familia",
      })
    } catch (err) {
        next(err)
    }

}

module.exports = showLineage;