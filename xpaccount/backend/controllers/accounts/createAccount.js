const { generateError } = require("../../helpers");

const createAccount = async (req, res, next) => {
  try {
    
    
    res.send({
      status: "ok",
      message: "Cuenta creada con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createAccount;
