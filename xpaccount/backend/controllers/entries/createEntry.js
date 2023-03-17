const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const selectCategoriesByIdUserQuery = require("../../bbdd/queries/categories/selectCategoriesByIdUserQuery");


const createEntry = async (req, res, next) => { 
  const {id: idUser} = req.user.id; 
  try {    
    // Comprobar que todos los campos obligatorios tienen datos
    if(!category || !subcategory || !amount) {
      throw generateError("No están todos los campos obligatorios cubiertos. Por favor, revise el asiento bancario que quiere crear", 404);
    }

    // Validación de los datos entregados
    // Categoría:
    const validatingCat = await selectCategoriesByIdUserQuery(idUser);
    console.log(validatingCat);
    res.send({
      status: "ok",
      message: "Asiento realizado con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createEntry;
