const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const selectEntryByIdQuery = require("../../bbdd/queries/entries/selectEntryByIdQuery");
const updateEntryQuery = require("../../bbdd/queries/entries/updateEntryQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");
const selectCategoriesByIdUserQuery = require("../../bbdd/queries/categories/selectCategoriesByIdAccountQuery");
const selectSubcatByIdCatAndNameSubcatQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndNameSubcatQuery");

const updateEntry = async (req, res, next) => {
  let { category, subcategory, amount, concept, comment } = req.body;
  const { idAccount, idEntry } = req.params;
  const idUser = req.user.id;
  try {
    // Comprobamos que los datos que entran son correctos
    // Seleccionamos el asiento bancario
    const myEntry = await selectEntryByIdQuery(idEntry);
    // Comprobar que la cuenta pertenece al usuario logueado
    const validatingAccount = await selectAccountByIdAccountQuery(idAccount);
    if (!validatingAccount || validatingAccount.idUser !== idUser) {
      throw generateError("La cuenta no existe", 404);
    }

    if(!category || !subcategory || !amount) {
      throw generateError("La categoría, subcategoría o cantidad no pueden quedar vacíos", 403)
    }

    // Son 2 valores que coexisten. Tienen que existir ambos a la hora de actualizar el dato
    if (category && subcategory) {
      const validatingCat = await selectCategoriesByIdUserQuery(
        idUser,
        category
      );
      if (!validatingCat) {
        throw generateError("La categoría no existe", 404);
      }

      const validatingSubcat = await selectSubcatByIdCatAndNameSubcatQuery(
        validatingCat.id,
        subcategory
      );
      if (!validatingSubcat) {
        throw generateError("La subcategoría no existe", 404);
      }
    }

    if (amount) {
      // Validamos el importe. Máximo 9 dígitos (incluidos los 2 decimales de precisión)
      const schemaAmount = joi.number().less(999999999).precision(2).required();
      const validationAmount = schemaAmount.validate(amount);
      if (validationAmount.error || validationAmount === null) {
        throw generateError("el importe no es una cantidad válida", 403);
      }
    }

    const schemaString = joi.string().max(195);
    if (concept) {
      // Validamos el texto de concept
      const validationConcept = schemaString.validate(concept);

      if (validationConcept.error) {
        throw generateError(
          "El concepto no puede exceder de los 195 caracteres",
          403
        );
      }
    }

    if (comment) {
      // Validamos el texto de concept
      const validationComment = schemaString.validate(comment);

      if (validationComment.error) {
        throw generateError(
          "El concepto no puede exceder de los 195 caracteres",
          403
        );
      }
    }

    if (!category || !subcategory) {
      category = myEntry.category;
      subcategory = myEntry.subcategory;
    }
    if (!amount) {
      amount = myEntry.amount;
    }
    if (!concept) {
      concept = myEntry.concept;
    }
    if (!comment) {
      comment = myEntry.comment;
    }

    await updateEntryQuery({
      idAccount,
      category,
      subcategory,
      amount,
      concept,
      comment,
      idEntry,
    });

    res.send({
      status: "ok",
      message: "Asiento actualizado 🔵",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateEntry;
