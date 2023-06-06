const {generateError} = require("../../helpers");
const bcrypt = require('bcrypt');
const data = require("../../assets/lineages.json")

const login = async (req, res, next) => {
  const {password} = req.body;

  // Encriptamos la contraseña
  const hashPass = await bcrypt.hash(password, 10);
  console.log(hashPass);
  try {
    console.log(password);
    const checkingPass = data.find(e => e.pass === password.toString());
    if(!checkingPass){              
      throw generateError("Contraseña incorrecta", 403);
    }

    res.send({
      status: "Ok",
      message: password,
      body: data,
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports =login;