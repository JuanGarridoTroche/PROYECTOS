const { generateError } = require("../../helpers");
const joi = require("@hapi/joi");
const insertNewCatQuery = require("../../bbdd/queries/categories/insertNewCatQuery");
const selectCategoryByIdAccountAndNameQuery = require("../../bbdd/queries/categories/selectCategoryByIdAccountAndNameQuery");


const createCategory = async (req, res, next) => {
  const {category, comment} = req.body;
  const {idAccount} = req.params;

  try {

    // Validamos el valor introducido por el usuario de la categoría
    // schema en el que indicamos que tiene que ser un string de mínimo 1 caracter y un máximo de 100, obligatorio y lo paso a mayúsculas.
    const schemaCat = joi.string().min(1).max(90).required().uppercase();
    
    // Valido el string comparándolo con mi esquema schemeCat.
    const validationCat = schemaCat.validate(category);

    if(validationCat.error || validationCat === null) {
      throw generateError("La categoría debe contener entre 1 y 100 caracteres. No puede quedar vacío.")
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
      
    // Comprobamos que no esté registrado como categoría en la base de datos
    const checkingCat = await selectCategoryByIdAccountAndNameQuery(idAccount, category);
    console.log("Comprobando categoría: ", checkingCat);
    
    if(checkingCat) {
      throw generateError("La categoría ya existe", 403);
    }

    // Procedemos a insertar la categoría
    await insertNewCatQuery(idAccount, category, comment);
    
    res.send({
      status: "ok",
      message: `La categoría '${category}' ha sido creada con éxito 🟢`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createCategory;
