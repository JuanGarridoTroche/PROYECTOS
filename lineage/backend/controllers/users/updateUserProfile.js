const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");
const updateUserDataQuery = require("../../queries/users/updateUserDataQuery");


const updateUserProfile = async (req, res, next) => {
  try {
    let {first_name, last_name1, last_name2} = req.body;
    
    const {id, email} = req.user;

    if(!first_name && !last_name1 && !last_name2) {
      throw generateError("No se ha realizado ningún cambio", 400)
    }

    // Traemos todos los datos del usuario logueado
    const user = await selectUserByEmailQuery(email);

    // Si el valor está en blanco le asignamos el valor original
    if(!first_name) {first_name = user.first_name;}
    if(!last_name1) {last_name1 = user.last_name1;}
    if(!last_name2) {last_name2 = user.last_name2;}

    // Actualizamos los datos
    await updateUserDataQuery({id, first_name, last_name1, last_name2})

   
    
    res.send({
      status: "Ok",
      message: "Usuario actualizado"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = updateUserProfile;