const {generateError} = require("../../helpers");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const data = require("../../assets/lineages.json");
const selectFamilyByPassword = require("../../assets/queries/selectFamiliyByPassword");
const getAllFamilies = require("../../assets/queries/getAllFamilies");


const login = async (req, res, next) => {
  

  try {   
    const { password} = req.body;

    // Validamos la contraseña  enviada
    const user = await selectFamilyByPassword(password);
    // console.log("Usuario:", user);

    if(user.length < 1) {
      throw generateError("Contraseña incorrectísima", 403);
    }

    // Conseguimos todos los nombres de las familias.
    const families = await getAllFamilies();

    console.log(families);

    
    res.send({
      status: "Ok",
      message: `login realizado con éxito por ${user}`, 
      data: user,     
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = login;