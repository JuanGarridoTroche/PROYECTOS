const deleteCategoryByIdQuery = require("../../bbdd/queries/categories/deleteCategoryByIdQuery");
const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndIdQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");
const { generateError } = require("../../helpers");
const selectEntriesByCatNameQuery = require("../../bbdd/queries/entries/selectEntriesByCatNameQuery");
const deleteSubcategoriesByIdCatQuery = require("../../bbdd/queries/subcategories/deleteSubcategoriesByIdCatQuery");

const deleteCategory = async (req, res, next) => {
  const { idAccount, idCategory } = req.params;
  const idUser = req.user.id;

  try {
    // Obtenemos todo
    const checkingUser = await selectAccountByIdAccountQuery(idAccount);
    if (idUser !== checkingUser.idUser) {
      throw generateError("Esta cuenta no pertenece al usuario", 403);
    }

    // Comprobamos que la categoría existe
    const checkingCat = await selectCategoryByIdQuery(idAccount, idCategory);

    // Si la variable no contiene ningún resultado => no existe
    if (!checkingCat) {
      throw generateError("La categoría no existe", 404);
    }

    // Comprobamos que la categoría no exista en ningún asiento bancario
    const checkingCatName = await selectEntriesByCatNameQuery(checkingCat.name, idAccount); 
    if(checkingCatName.length > 0) {
      throw generateError("Debes modificar los asientos bancarios que tengan esta categoría antes de eliminarla", 403)
    }

    //Eliminamos la categoría y subcategorías
    await deleteCategoryByIdQuery(idCategory, idAccount);

   
    res.send({
      status: "ok",
      message: `Categoría ${checkingCat.name} y subcategorías eliminadas 🔴`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategory;
