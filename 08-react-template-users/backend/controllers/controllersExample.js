

const example = async (req, res, next) => {
  try {
    
    res.send({
      status: "Ok",
      message: "Login realizado con éxito"
    })
  } catch (err) {
    next(err);
  }
}

module.exports = example;