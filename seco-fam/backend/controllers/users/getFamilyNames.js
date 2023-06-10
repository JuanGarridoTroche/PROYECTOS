const getAllFamilies = require("../../assets/queries/getAllFamilies");

const getFamilyNames = async (req, res, next) => {  

  try {    
     // Conseguimos todos los nombres de las familias.
     const families = await  getAllFamilies();

    
    res.send({
      status: "Ok",
      message: "Familias de la web", 
      data: families,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = getFamilyNames;