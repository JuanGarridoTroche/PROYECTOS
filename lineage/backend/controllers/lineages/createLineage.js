

const createLineage = async (req, res, next) => {
  try {
    const {lineage} = req.body;
    console.log(lineage);
    // Si tiene foto, la guardamos 
    if(req.files) {
      // Recorremos las fotos. Solo se subirá una
      for (const photo of Object.values(req.files).slice(0, 1)){
        // Guardamos la foto en disco
        const photoName = await savePhoto
      }
    }
    
    res.send({
      status: "Ok",
      message: "Linaje creado"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = createLineage;