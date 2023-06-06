const {generateError} = require("../../helpers");
const bcrypt = require('bcrypt');
const data = require("../../assets/lineages.json")

const login = async (req, res, next) => {
  const {lineage, password} = req.body;

  try {

    // Comprobamos que la familia introducida existe
    const checkingLineage = data.find(e => e.lineage === lineage);
    if(!checkingLineage) {
      throw generateError("Datos y/o contraseña incorrecto/s", 400)
    }

    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, checkingLineage.password);
    console.log(validPassword);
   
    if(!validPassword){              
      throw generateError("Datos y/o contraseña incorrecto/s", 400);
    }

    res.send({
      status: "Ok",
      message: `login realizado con éxito por '${checkingLineage.lineage}'`,
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports =login;