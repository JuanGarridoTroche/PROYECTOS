const {generateError} = require("../../helpers")
const selectFamilyById = require("../../assets/queries/selectFamiliyById");

const readLoggedProfile = async(req, res, next)=> {
  
  try {
    if(!req.user.id) {
      throw generateError(`No tienes acceso a la familia ${req.user.lineage}`, 400);
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