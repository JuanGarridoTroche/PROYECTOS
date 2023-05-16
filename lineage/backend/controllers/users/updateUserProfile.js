const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");
const selectUserByIdQuery = require("../../queries/users/selectUserByIdQuery");
const updateUserDataQuery = require("../../queries/users/updateUserDataQuery");


const updateUserProfile = async (req, res, next) => {
  try {
    let {newEmail, first_name, last_name1, last_name2} = req.body;    
    
    // Valores sacados del token
    const {id} = req.user;


    if(!newEmail && !first_name && !last_name1 && !last_name2) {
      throw generateError("No se ha realizado ningún cambio", 400)
    }

    // Traemos todos los datos del usuario logueado
    const user = await selectUserByIdQuery(id);
    console.log(user);

    // Comprobamos que el newEmail no esté ya registrado en la BBDD
    const checkNewEmail = await selectUserByEmailQuery(newEmail);   

    if (checkNewEmail.email && checkNewEmail.email !== user.email) {
      throw generateError("La cuenta de correo ya está registrada", 403);
    }
    
    // Si el valor está en blanco le asignamos el valor original    
    if(!first_name) {first_name = user.first_name;}
    if(!last_name1) {last_name1 = user.last_name1;}
    if(!last_name2) {last_name2 = user.last_name2;}



    // Actualizamos los datos
    await updateUserDataQuery({id, newEmail, first_name, last_name1, last_name2})

   
    
    res.send({
      status: "Ok",
      message: "Usuario actualizado"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = updateUserProfile;