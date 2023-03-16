const { generateError } = require("../../helpers");

const deleteEntry = async (req, res, next) => {
  try {
    
    
    res.send({
      status: "ok",
      message: "Asiento eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteEntry;
