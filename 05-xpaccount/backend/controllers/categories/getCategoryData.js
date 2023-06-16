const selectCategoriesByIdAccountQuery = require("../../bbdd/queries/categories/selectCategoriesByIdAccountQuery");
const selectCategoryByIdAccountAndIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndIdQuery");


const getCategoryData = async (req, res, next) => {
  
  const {idAccount, idCategory} = req.params;
 
  try {

    //Seleccionamos las categorías de la cuenta idAccount
    const myCategory = await selectCategoryByIdAccountAndIdQuery(idAccount, idCategory);
    
    res.send({
      status: "ok",
      message: `Datos de la Categoría ${myCategory.name}🟢`,
      data: myCategory,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getCategoryData;
