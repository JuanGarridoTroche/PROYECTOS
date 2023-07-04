const selectFamilyByUrl = require("../../assets/queries/selectFamilyByUrl");
const { generateError } = require("../../helpers");

const getFamilyDataByUrl = async (req, res, next) => {
  const {id} = req.user;
  const {url} = req.params;
  console.log(url);
  try {
    if(id !== 'fs-VvW-X6l-hI') {
      throw generateError("No tienes permiso para ver esta información", 403)
    }

     // Conseguimos todos los nombres de las familias.
     const familyData = await  selectFamilyByUrl(url);

    
    res.send({
      status: "Ok",
      message: "Datos de la familia", 
      data: familyData,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = getFamilyDataByUrl;