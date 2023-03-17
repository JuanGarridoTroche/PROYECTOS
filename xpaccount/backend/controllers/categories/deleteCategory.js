const { generateError } = require("../../helpers");

const deleteCategory = async (req, res, next) => {
  try {
    
    
    res.send({
      status: "ok",
      message: "Categoría eliminada 🔴",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategory;
