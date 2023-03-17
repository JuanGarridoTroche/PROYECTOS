const { generateError } = require("../../helpers");

const updateCategory = async (req, res, next) => {
  try {
    
    
    res.send({
      status: "ok",
      message: "Categoría actualizada 🔵",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateCategory;
