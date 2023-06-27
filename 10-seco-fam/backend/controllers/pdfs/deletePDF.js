
const deletePDF = async(req, res, next) => {

  try {
    const {pdf, lineage} = req.body;
    

    res.send({
      status: "Ok",
      message: "Fichero eliminado",
    })
  } catch (err) {
    next(err);
  }
}

module.exports = deletePDF;