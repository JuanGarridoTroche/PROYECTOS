const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const selectCategoriesByIdUserQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndNameQuery");
const selectSubcatByIdCatAndNameSubcatQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndNameSubcatQuery");
const insertEntryQuery = require("../../bbdd/queries/entries/insertEntryQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");

const createEntry = async (req, res, next) => {
  const idUser = req.user.id;
  const {idAccount} = req.params;

  const { dateEntry, category, subcategory, amount, concept, comment } = req.body;
  try {
    // Comprobar que la cuenta pertenece al usuario logueado
    const validatingAccount = await selectAccountByIdAccountQuery(idAccount)
    if(!validatingAccount || validatingAccount.idUser !== idUser) {
      throw generateError("La cuenta no existe", 404)
    }

    // Comprobar que todos los campos obligatorios tienen datos
    if (!category || !subcategory || !amount) {
      throw generateError(
        "No están todos los campos obligatorios cubiertos. Por favor, revise el asiento bancario que quiere crear",
        404
      );
    }

    // Validación de los datos entregados

    // Fecha del asiento bancario
    let dateEntryValue = dateEntry.split("/", 3).reverse().join("/");
    const schemaDateEntry = joi.date().required();
    const validationDateEntry = schemaDateEntry.validate(dateEntryValue);

    if(validationDateEntry.error) {
      throw generateError("La fecha no es válida. Introdúzcala con el siguiente formato: dd/mm/aaaa", 403)
    }

    // Categoría:
    const validatingCat = await selectCategoriesByIdUserQuery(idAccount, category);
    if(!validatingCat) {throw generateError("La categoría no existe", 404)}

    // Validamos la Subcategoría:
    const validatingSubcat = await selectSubcatByIdCatAndNameSubcatQuery(validatingCat.id, subcategory);
    if(!validatingSubcat) {throw generateError("La subcategoría no existe", 404)}

    // Validamos el importe. Máximo 9 dígitos (incluidos los 2 decimales de precisión)
    const schemaAmount = joi.number().less(999999999).precision(2).required();
    const validationAmount = schemaAmount.validate(amount);
    if(validationAmount.error || validationAmount === null) {
      throw generateError("el importe no es una cantidad válida", 403)
    }

    // Validamos el texto de concept y comment
    const schemaString = joi.string().max(195)
    if (concept) {
      const validationConcept = schemaString.validate(concept);
      
      if(validationConcept.error) {
        throw generateError("El concepto o comentario no pueden exceder de los 195 caracteres", 403)
      }
    }
    
    if(comment) {
      const validationComment = schemaString.validate(comment);

      if(validationComment.error) {
        throw generateError("El concepto o comentario no pueden exceder de los 195 caracteres", 403)
      }
    }

    // Insertamos los datos
    await insertEntryQuery( idAccount, req.body)


    res.send({
      status: "ok",
      message: "Asiento realizado con éxito 🟢",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createEntry;
