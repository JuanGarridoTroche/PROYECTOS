const { savePhoto } = require("../../helpers");


const createLineage = async (req, res, next) => {
  try {
    const {lineage} = req.body;
    console.log(lineage);
    // Si tiene foto, la guardamos 
    const photos = [];
    if(req.files) {
      // Recorremos las fotos. Solo se subirá una
      for (const photo of Object.values(req.files).slice(0, 1)){
        // Guardamos la foto en disco
        const photoName = await savePhoto(photo, 1);

        // Pusheamos el nombre de la foto al array de fotos
        photos.push(photoName)

        // Guardamos el nombre de la foto en el registro de la BBDD
        await insert
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