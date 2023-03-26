const { generateError } = require("../../helpers");

const updateCategoryQuery = require("../../bbdd/queries/categories/updateCategoryQuery");
const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdQuery");

const updateCategory = async (req, res, next) => {
  try {
    let {category, comment} = req.body;
    const {idAccount, idCategory} = req.params;

    // Comprobar que la categoría que se quiere modificar pertenece al usuario logueado
    const checkingCat = await selectCategoryByIdQuery(idAccount, idCategory);

    // Si enviamos un id incorrecto O el id del usuario que creó la cuenta es distinto al que está logueado
    if (!checkingCat) {
      throw generateError("Esta categoría no existe", 404);
    }

    // Si hay algún dato que no se desee modificar (vienen en blanco), cogemos los datos que ya existen
    if (!category) {
      category = checkingCat.name;
    }
    if (!comment) {
      comment = checkingCat.comment;
    }

    // Editamos los valores alias y/o bankName de la cuenta
    await updateCategoryQuery({
      idCategory,
      category,
      comment,
    });
    
    
    res.send({
      status: "ok",
      message: "Categoría actualizada 🔵", 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateCategory;
