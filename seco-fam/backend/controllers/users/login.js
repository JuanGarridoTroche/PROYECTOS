const {generateError} = require("../../helpers");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const data = require("../../assets/lineages.json");
const { check } = require("prettier");

const login = async (req, res, next) => {
  const {lineage, password} = req.body;
  let getData = [];

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

    
    const tokenInfo = {
      id: checkingLineage.id,
      active: checkingLineage.active,
      lineage: checkingLineage.lineage,
    }
    
    const token = jwt.sign(tokenInfo, process.env.SECRET);
    
    checkingLineage.lineage !== 'seco-admin' ? loggedLineage = checkingLineage.lineage : loggedLineage = [...data];
    
    res.send({
      status: "Ok",
      message: `login realizado con éxito por '${checkingLineage.lineage}'`,
      data: {loggedLineage, token},
      
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = login;