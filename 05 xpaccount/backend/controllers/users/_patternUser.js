const { generateError } = require("../../helpers");

const loginUser = async (req, res, next) => {
  try {
    
    res.send({
      status: "ok",
      message: "Login realizado con éxito",
      data: {
        tokenXpAccount,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
