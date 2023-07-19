const selectUserByIdQuery = require("../../queries/users/selectUserByIdQuery");

const readProfile = async(req, res, next) => {
  const { id } = req.params;
  try {
    const userProfile = await selectUserByIdQuery(id);
       
    userProfile.createdAt = userProfile.createdAt.toLocaleDateString();
    userProfile.modifiedAt = userProfile.modifiedAt.toLocaleDateString();

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