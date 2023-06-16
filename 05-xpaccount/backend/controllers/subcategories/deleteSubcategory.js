const selectAccountByIdCatQuery = require("../../bbdd/queries/accounts/selectAccountByIdCatQuery");
const selectAccountByIdUserAndIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdUserAndIdAccountQuery");
const selectCategoryByIdAccountAndIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndIdQuery");
const selectEntriesBySubcatNameQuery = require("../../bbdd/queries/entries/selectEntriesBySubcatNameQuery");
const deleteSubcategoryByIdQuery = require("../../bbdd/queries/subcategories/deleteSubcategoryByIdQuery");
const selectSubcatByIdCatAndIdSubQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndIdSubQuery");
const { generateError } = require("../../helpers");

const deleteCategory = async (req, res, next) => {
  const { idCategory, idSub } = req.params;
  const idUser = req.user.id;

  try {
    // Recuperar el idAccount propietario de la categoría
    const recoverAccount = await selectAccountByIdCatQuery(idCategory);
    if(!recoverAccount){
      throw generateError("La categoría no existe", 404)
    }

    // Comprobar que la categoría existe dentro de la cuenta bancaria idAccount
    const checkingCat = await selectCategoryByIdAccountAndIdQuery(recoverAccount.idAccount, idCategory);
    // Si la variable no contiene ningún resultado => no existe
    if (!checkingCat) {
      throw generateError("La categoría no existe", 404);
    }
    
    // Comprobar que la categoría pertenece al usuario logueado
    const checkingAccount = await selectAccountByIdUserAndIdAccountQuery(idUser, recoverAccount.idAccount);
    if(!checkingAccount) {
      throw generateError("La cuenta no existe", 404);
    }


    // Comprobamos que la subcategoría existe (ya sabemos que la categoría pertence al usuario logueado)
    const checkingSubcat = await selectSubcatByIdCatAndIdSubQuery(
      idCategory,
      idSub
    );

    if (!checkingSubcat) {
      throw generateError("La subcategoría no existe", 404);
    }

    // Comprobamos que la subcategoría no está en ningún asiento bancario.
    const checkingEntriesWithSubcat = await selectEntriesBySubcatNameQuery(checkingSubcat.name);

    if(checkingEntriesWithSubcat.length > 0) {
      throw generateError("Debes modificar los asientos bancarios que tenga esta subcategoría antes de poder eliminarla", 403)
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
