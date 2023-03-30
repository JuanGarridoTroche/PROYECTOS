const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndIdQuery");
const deleteSubcategoryByIdQuery = require("../../bbdd/queries/subcategories/deleteSubcategoryByIdQuery");
const selectSubcatByIdCatAndIdSubQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndIdSubQuery");
const { generateError } = require("../../helpers");

const deleteCategory = async (req, res, next) => {
  const { idCategory, idSub } = req.params;
  const idUser = req.user.id;
  try {
    // Comprobar que la categoría pertenece al usuario logueado
    const checkingCat = await selectCategoryByIdQuery(idUser, idCategory);

    // Si la variable no contiene ningún resultado => no existe
    if (!checkingCat) {
      throw generateError("La categoría no existe", 404);
    }

    // Comprobamos que la subcategoría existe (ya sabemos que la categoría pertence al usuario logueado)
    const checkingSubcat = await selectSubcatByIdCatAndIdSubQuery(
      idCategory,
      idSub
    );

    if (!checkingSubcat) {
      throw generateError("La subcategoría no existe", 404);
    }

    //Eliminamos la subcategoría
    await deleteSubcategoryByIdQuery(idCategory, idSub);

    res.send({
      status: "ok",
      message: `Subcategoría '${checkingSubcat.name}' eliminada 🔴`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategory;
