const {generateError} = require("../../helpers");
const jwt = require("jsonwebtoken");
const selectFamilyByPassword = require("../../assets/queries/selectFamiliyByPassword");
const getAllFamilies = require("../../assets/queries/getAllFamilies");


const login = async (req, res, next) => {
  

  try {   
    const { password} = req.body;

    // Validamos la contraseña  enviada
    const user = await selectFamilyByPassword(password);
    // console.log("Usuario:", user.lineage);

    if(!user) {
      throw generateError("Contraseña incorrectísima", 403);
    }

    // Conseguimos todos los nombres de las familias.
    const families = await getAllFamilies();

    // console.log(families);

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      active:user.active,
      lineage: user.lineage,
    };

    // Creamos el token
    const token = jwt.sign(tokenInfo, process.env.SECRET);
    // console.log(token);

    
    res.send({
      status: "Ok",
      message: `login realizado con éxito por ${user.lineage}`, 
      data: user,
      token,    
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = login;