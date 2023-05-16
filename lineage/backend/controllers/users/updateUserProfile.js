const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");
const updateUserDataQuery = require("../../queries/users/updateUserDataQuery");


const updateUserProfile = async (req, res, next) => {
  try {
    let {newEmail, first_name, last_name1, last_name2} = req.body;
    
    // Valores sacados del token
    const {id, email} = req.user;

    if(!first_name && !last_name1 && !last_name2) {
      throw generateError("No se ha realizado ningún cambio", 400)
    }

    // Traemos todos los datos del usuario logueado
    const user = await selectUserByEmailQuery(email);

    
    // Si el valor está en blanco le asignamos el valor original
    if(!newEmail) {newEmail = user.email}
    if(!first_name) {first_name = user.first_name;}
    if(!last_name1) {last_name1 = user.last_name1;}
    if(!last_name2) {last_name2 = user.last_name2;}

    // Comprobamos que el newEmail no esté ya registrado en la BBDD
    const checkNewEmail = await selectUserByEmailQuery(newEmail);

    if(checkNewEmail) {
      throw generateError("No se ha podido actualizar por credenciales inválidas", 403);
    }

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