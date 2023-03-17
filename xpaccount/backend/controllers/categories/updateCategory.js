const { generateError } = require("../../helpers");

const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdQuery");
const updateCategoryQuery = require("../../bbdd/queries/categories/updateCategoryQuery");

const updateCategory = async (req, res, next) => {
  try {
    let {category, comment} = req.body;
    const {idCategory} = req.params;
    const idUser = req.user.id;

    // Comprobar que la categoría que se quiere modificar pertenece al usuario logueado
    const checkingCat = await selectCategoryByIdQuery(idUser, idCategory);

    // Si enviamos un id incorrecto O el id del usuario que creó la cuenta es distinto al que está logueado
    if (!checkingCat) {
      throw generateError("Esta categoría no existe", 404);
    }

    // Si hay algún dato que no se desee modificar (vienen en blanco), cogemos los datos que ya existen
    if (!category) {
      console.log("Entra!");
      category = checkingCat.name;
    }
    if (!comment) {
      comment = checkingCat.comment;
    }

    console.log(idCategory, category, comment);

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
