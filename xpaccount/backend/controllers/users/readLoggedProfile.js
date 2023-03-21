const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const { generateError } = require("../../helpers");

const readLoggedProfile = async (req, res, next) => {
  try {
    if(!req.user?.id){      
      throw generateError(`El usuario ${req.user.id} no existe`, 400)
    }

    // Seleccionamos los datos del usuario logueado
    const user = await selectUserByIdQuery(req.user.id);
    const {username, email, birthday, firstName, lastName, dni, active, createdAt, modifiedAt} = user;
    
    res.send({
      status: "ok",
      message: "Perfil del usuario legueado",
      data: {
        username,
        email,
        birthday,
        firstName,
        lastName,
        dni,
        active,
        createdAt,
        modifiedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readLoggedProfile;
