
const template = async (req, res, next) => {
  

  try {   
   

    
    res.send({
      status: "Ok",
      message: `login realizado con éxito por ${user.lineage}`, 
      data: user,
      token: token,
      families: families,   
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = template;