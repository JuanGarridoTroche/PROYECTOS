const {generateError} = require("../../helpers")
const data = require("../../assets/lineages.json");
const selectFamilyById = require("../../assets/queries/selectFamiliyById");

const readLoggedProfile = async(req, res, next)=> {
  try {
    if(!req.user.id) {
      throw generateError(`La familia ${req.user.lineage} no existe`, 400);
    }

    //Seleccionamos los datos del usuario logueado 
    user = await selectFamilyById(req.user.id);

    res.send({
      status: "Ok",
      message: "Perfil del usuario logueado",
      data: user,
    })

    
  } catch (err) {
    next(err)
  }
}

module.exports = readLoggedProfile;