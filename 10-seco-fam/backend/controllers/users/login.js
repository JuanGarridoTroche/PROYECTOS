const {generateError} = require("../../helpers");
const jwt = require("jsonwebtoken");
const selectFamilyByPassword = require("../../assets/queries/selectFamiliyByPassword");

const login = async (req, res, next) => {
  try {   
    const { password} = req.body;

    // Validamos la contraseña  enviada
    const user = await selectFamilyByPassword(password);
    // console.log("Usuario:", user.lineage);

    // Si user no tiene datos => contraseña incorrecta
    if(!user) {
      throw generateError("Contraseña incorrecta", 403);
    }

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      active:user.active,
      lineage: user.lineage,
    };

    // Creamos el token
    const token = jwt.sign(tokenInfo, process.env.SECRET);
    
    res.send({
      status: "Ok",
      message: `login realizado con éxito por la familia ${user.lineage}`, 
      data: user,
      token: token,  
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = login;