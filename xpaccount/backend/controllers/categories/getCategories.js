const selectCategoriesByIdAccountQuery = require("../../bbdd/queries/categories/selectCategoriesByIdAccountQuery");


const getCategories = async (req, res, next) => {
  
  const {idAccount} = req.params;
 
  try {

    //Seleccionamos las categorías de la cuenta idAccount
    const myCategories = await selectCategoriesByIdAccountQuery(idAccount);
    
    res.send({
      status: "ok",
      message: `Categorías fde la cuenta ${idAccount}🟢`,
      data: myCategories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getCategories;
