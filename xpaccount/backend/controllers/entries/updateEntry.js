const { generateError } = require("../../helpers");

const updateEntry = async (req, res, next) => {
  try {
    
    
    res.send({
      status: "ok",
      message: "Asiento actualizado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateEntry;
