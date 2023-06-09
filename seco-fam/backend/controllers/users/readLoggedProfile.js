
const readLoggedProfile = async(req, res, next)=> {
  try {
    console.log(req.user.id);
  } catch (err) {
    next(err)
  }
}

module.exports = readLoggedProfile;