const deleteCategoryByIdQuery = require("../../bbdd/queries/categories/deleteCategoryByIdQuery");
const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdQuery");
const { generateError } = require("../../helpers");

const deleteCategory = async (req, res, next) => {
  const {idCategory} = req.params;  
  const idUser = req.user.id;
  try {
    // Comprobar que la categoría que queremos eliminar pertenece al usuario logueado    
    const checkingCat = await selectCategoryByIdQuery(idUser, idCategory);

    // Si la variable no contiene ningún resultado => no existe 
    if(!checkingCat) {throw generateError("La categoría no existe", 404)}

    //Eliminamos la categoría
    await deleteCategoryByIdQuery(idCategory, idUser);
    
    
    res.send({
      status: "ok",
      message: "Categoría eliminada 🔴",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategory;
