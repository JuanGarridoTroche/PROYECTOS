const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const selectCategoriesByIdUserQuery = require("../../bbdd/queries/categories/selectCategoriesByIdUserQuery");
const selectSubcatByIdCatAndIdSubQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndIdSubQuery");

const createEntry = async (req, res, next) => {
  const idUser = req.user.id;

  const { category, subcategory, amount, concept, comment } = req.body;
  try {
    // Comprobar que todos los campos obligatorios tienen datos
    if (!category || !subcategory || !amount) {
      throw generateError(
        "No están todos los campos obligatorios cubiertos. Por favor, revise el asiento bancario que quiere crear",
        404
      );
    }

    // Validación de los datos entregados
    // Categoría:
    const validatingCat = await selectCategoriesByIdUserQuery(idUser, category);

    // Validamos la Subcategoría:
    const validatingSubcat = await selectSubcategosriesByIdUser(
      validatingCat.category
    );

    res.send({
      status: "ok",
      message: "Asiento realizado con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createEntry;
