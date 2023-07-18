
const updateProfile = async(req, res, next) => {
  try {
    
    res.send({
      status: "Ok",
      message: "Usuario actualizado"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = updateProfile;