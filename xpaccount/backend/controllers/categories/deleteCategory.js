
const deleteCategoryByIdQuery = require("../../bbdd/queries/categories/deleteCategoryByIdQuery");
const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery")
const { generateError } = require("../../helpers");

const deleteCategory = async (req, res, next) => {
  const {idAccount, idCategory} = req.params;
  const idUser = req.user.id;

  try {
    // Obtenemos todo    
    const checkingUser = await selectAccountByIdAccountQuery(idAccount);
    if(idUser !== checkingUser.idUser) {
      throw generateError("Esta cuenta no pertenece al usuario", 403)
    }

    // Comprobamos que la categoría existe
    const checkingCat = await selectCategoryByIdQuery(idAccount, idCategory);

    // Si la variable no contiene ningún resultado => no existe 
    if(!checkingCat) {throw generateError("La categoría no existe", 404)}
    

    //Eliminamos la categoría
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
