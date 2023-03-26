const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const insertNewSubcatQuery = require("../../bbdd/queries/subcategories/insertNewSubcatQuery");
const selectSubcatByIdCatAndNameSubcatQuery = require("../../bbdd/queries/subcategories/selectSubcatByIdCatAndNameSubcatQuery");
const selectCategoryByIdQuery = require("../../bbdd/queries/categories/selectCategoryByIdQuery");


const createSubcategory = async (req, res, next) => {
  const {nameSubcat, comment} = req.body;  
  const {idCategory} = req.params;

  try {

    // Validamos el valor introducido por el usuario de la categoría
    // schema en el que indicamos que tiene que ser un string de mínimo 1 caracter y un máximo de 100, obligatorio y lo paso a mayúsculas.
    const schemaNameSubcat = joi.string().min(1).max(90).required();
    
    // Valido el string comparándolo con mi esquema schemeCat.
    const validationNameSubcat = schemaNameSubcat.validate(nameSubcat);

    if(validationNameSubcat.error || validationNameSubcat === null) {
      throw generateError("La subcategoría debe contener entre 1 y 100 caracteres. No puede quedar vacío.")
    }
    
    // Como el comentario no es obligatorio, puede venir vacío, así que solo lo analizaremos si viene algo
    if(comment) {
      // schema en el que indicamos que tiene que ser un string de mínimo 1 caracter y un máximo de 100, obligatorio y lo paso a mayúsculas.
      const schemaComment = joi.string().min(1).max(192);
      
      // Valido el string comparándolo con mi esquema schemeCat.
      const validationComment = schemaComment.validate(comment);
      
      if(validationComment.error) {
        throw generateError("El comentario no puede exceder de 192 caracteres.")
      }
    }


    // Comprobamos que la categoría pertenece al usuario logueado
    const checkingCat = await selectCategoryByIdQuery(idCategory)
      
    // Comprobamos que no esté registrado como categoría en la base de datos
    const checkingNameSubcat = await selectSubcatByIdCatAndNameSubcatQuery(idCategory, nameSubcat);
    
    if(checkingNameSubcat) {
      throw generateError("La categoría ya existe", 403);
    }



    // Procedemos a insertar la categoría
    await insertNewSubcatQuery(idCategory, nameSubcat, comment);
    
    res.send({
      status: "ok",
      message: "Subcategoría creada 🟢",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createSubcategory;
