const { generateError } = require("../../helpers");

const Entry = async (req, res, next) => {
  try {
    
    res.send({
      status: "ok",
      message: "Asiento realizado con éxito",
      entry,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = Entry;
