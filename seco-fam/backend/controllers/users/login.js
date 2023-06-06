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

    // Comprobamos que la familia está activa
    if(!checkingLineage.active) {
      throw generateError("Por favor, contacte con el administrador para solucionar este problema")
    }

    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, checkingLineage.password);
    
   
    // Si no coincide la contraseña, lanzamos error
    if(!validPassword){              
      throw generateError("Datos incorrectos", 400);
    } 
    let getData = [];

    checkingLineage.lineage !== 'seco-admin' ? getData = checkingLineage.lineage : getData = [...data];
   

    res.send({
      status: "Ok",
      message: `login realizado con éxito por '${checkingLineage.lineage}'`,
      data: getData,
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = login;