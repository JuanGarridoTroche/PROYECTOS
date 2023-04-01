const selectSubcatsByIdCatQuery = require("../../bbdd/queries/subcategories/selectSubcatsByIdCatQuery");

const getSubcategories = async (req, res, next) => {
  const { idCategory } = req.params;

  try {   

    // Comprobamos que la categoría pertenece al usuario logueado
    

    // Obtenemos todas las subcategorías de la categoría con idCategory
    const mySubcategories = await selectSubcatsByIdCatQuery(idCategory);    


    res.send({
      status: "ok",
      message: `Subcategorías de la categoría ${idCategory}🟢`,
      data: mySubcategories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getSubcategories;
