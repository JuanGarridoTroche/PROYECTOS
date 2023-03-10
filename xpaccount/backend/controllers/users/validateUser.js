const updateUserRegistrationCodeQuery = require("../../bbdd/queries/users/updateUserRegistrationCodeQuery");


const validateUser = async (req, res, next) => {
  try {
    const {registrationCode} = req.params;
    
    // Activamos el usuario
    await updateUserRegistrationCodeQuery(registrationCode);

    res.send({
      status: "ok",
      message: "Usuario activado con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = validateUser;
