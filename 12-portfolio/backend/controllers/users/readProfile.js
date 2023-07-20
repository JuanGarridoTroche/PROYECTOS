const selectUserByIdQuery = require("../../queries/users/selectUserByIdQuery");

const readProfile = async(req, res, next) => {
  const { idUser } = req.params;
  try {
    const userProfile = await selectUserByIdQuery(idUser);
       
    userProfile.createdAt = userProfile.createdAt.toLocaleDateString();
    if(userProfile.modifiedAt) userProfile.modifiedAt = userProfile.modifiedAt.toLocaleDateString();

    res.send({
      status: 'Ok',
      message: 'Lectura de usuario',
      body: userProfile,
    });
    
  } catch (err) {
    next(err)
  }
}

module.exports = readProfile;