const { generateError } = require("../../helpers");

const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndIdQuery");
const selectAccountByIdCatQuery = require("../../bbdd/queries/accounts/selectAccountByIdCatQuery")
const selectSubcatByIdCatAndIdSubQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndIdSubQuery");
const updateSubcategoryQuery = require("../../bbdd/queries/subcategories/updateSubcategoryQuery");
const updateSubcategoryAllEntriesQuery = require("../../bbdd/queries/entries/updateSubcategoryAllEntriesQuery");

const updateSubcategory = async (req, res, next) => {
  try {
    let { nameSubcat, comment } = req.body;
    const { idCategory, idSub } = req.params;
    const idUser = req.user.id;

    // Traer el idAccount de idCategory
    const checkingAccount = await selectAccountByIdCatQuery(idCategory);
    
    if(!checkingAccount) {
      throw generateError("Esta categoría no existe", 404);
    }

    // Comprobar que la categoría pertenece al usuario logueado
    const checkingCat = await selectCategoryByIdQuery(checkingAccount.idAccount, idCategory);

    // Si enviamos un id incorrecto O el id del usuario que creó la cuenta es distinto al que está logueado
    if (!checkingCat) {
      throw generateError("Esta categoría no existe", 404);
    }

    // Comprobamos que la subcategoría existe y pertence al usuario logueado
    const checkingSubcat = await selectSubcatByIdCatAndIdSubQuery(
      idCategory,
      idSub
    );
       
    if (!checkingSubcat) {
      throw generateError("La subcategoría no existe", 404);
    }

    // Si hay algún dato que no se desee modificar (vienen en blanco), cogemos los datos que ya existen
    if (!nameSubcat) {
      nameSubcat = checkingSubcat.name;
    }
    if (!comment) {
      comment = checkingSubcat.comment;
    }
    
    // Editamos los valores alias y/o bankName de la cuenta
    await updateSubcategoryQuery({
      idCategory,
      idSub,
      nameSubcat,
      comment,
    });
    
    // Actualizamos todos los asientos bancarios con el nuevo nombre de subcategoría
    await updateSubcategoryAllEntriesQuery(nameSubcat, checkingSubcat.name)

    res.send({
      status: "ok",
      message: `Subcategoría actualizada a '${nameSubcat}' 🔵`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateSubcategory;
