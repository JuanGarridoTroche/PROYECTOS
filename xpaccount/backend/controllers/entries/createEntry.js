const { generateError } = require("../../helpers");

const createEntry = async (req, res, next) => {
  try {
    // 
    
    res.send({
      status: "ok",
      message: "Asiento realizado con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createEntry;
