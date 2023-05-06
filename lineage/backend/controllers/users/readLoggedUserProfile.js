const selectUserByEmailQuery = require("../../queries/users/selectUserByEmailQuery");


const readLoggedUserProfile = async (req, res, next) => {
  const {email} = req.user;
  try {
    // Accedo a los datos del usuario:
    const user = await selectUserByEmailQuery(email);
    console.log(user);
    
    
    res.send({
      status: "Ok",
      message: `Datos de la cuenta de ${user.first_name} ${user.last_name1} ${user.last_name2}:`,
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name1: user.last_name1,
        last_name2: user.last_name2,
        email: user.email,
        role: user.role,
        active: user.active,
      }
    })
  } catch (err) {
    next(err);
  }
}

module.exports = readLoggedUserProfile;