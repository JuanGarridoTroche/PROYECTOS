"use strict";

const selectNewsByIdQuery = require("../../bbdd/queries/news/selectNewsByIdQuery");
const updateNewsQuery = require("../../bbdd/queries/news/updateNewsQuery");
const { generateError, savePhoto } = require("../../helpers");
const deletePhotoNewsQuery = require("../../bbdd/queries/news/deletePhotoNewsQuery");
const joi = require("@hapi/joi");
const insertPhotoQuery = require("../../bbdd/queries/news/insertPhotoQuery");

const editNews = async (req, res, next) => {
  try {
    const { idNews } = req.params;
    let { title, summary, body, category } = req.body;

    // Comprobamos que han introducido un idNews válido
    if (!Number(idNews) || idNews < 1) {
      throw generateError("El id de la noticia no es correcto", 404);
    }

    // Seleccionamos los datos de la noticia a modificar
    const news = await selectNewsByIdQuery(idNews);

    //Comprobamos que la noticia que queremos modificar pertenece al usuario que está logueado
    if (news.idUser !== req.user.id) {
      throw generateError("La noticia no pertenece al usuario logueado", 400);
    }  


    // Si category no corresponde a ninguna categoría válida, category = 'general'
    const listOfCategories = [
      "deportes",
      "videojuegos",
      "noticias",
      "programación",
      "viajes",
      "tecnología",
      "música",
      "memes",
      "general",
    ];

    if (category && !listOfCategories.includes(category))
      throw generateError(`La categoría no es correcta. Por favor, introduce una de las siguientes categorías: 
    deportes, videojuegos, noticias, programación, viajes, tecnología, música, memes o general`);

    if (!category) category = news.category;
    if (!title) title = news.title;
    if (!summary) summary = news.summary;
    if (!body) body = news.body;

    const schemaTitle = joi
      .string()
      .min(4)
      .max(100)
      .required()
      .error(new Error("El título no puede ser menor a 4 caracteres ni mayor a 100 caracteres", 400));
    const validationTitle = schemaTitle.validate(title);

    if (validationTitle.error || validationTitle === null) {
      throw generateError(validationTitle.error.message);
    }

    const schemaBody = joi
      .string()
      .min(10)
      .max(1000)
      .required()
      .error(new Error("El texto no puede ser menor a 10 caracteres o mayor a 1000 caracteres", 400));
    const validationBody = schemaBody.validate(body);

    if (validationBody.error || validationBody === null) {
      throw generateError(validationBody.error.message);
    }

    // Modificamos los datos
    await updateNewsQuery(category, title, summary, body, idNews);

    // Vamos a comprobar si hay fotos (máximo 3) y si tienen la extensión de una imagen válida
    const photos = [];

    // Si "req.files" tiene fotos, las guardamos
    if (req.files) {
      
      // Eliminamos las fotos anteriores
      await deletePhotoNewsQuery(idNews)     
      
      // Recorremos las fotos. Si existen más de 3 solo subirá las 3 primeras      
      for (const photo of Object.values(req.files).slice(0, 3)) {        

        // Guardamos la foto en el disco
        const photoName = await savePhoto(photo, 1); 
        
        // Pusheamos el nombre de la foto al array de fotos
        photos.push(photoName);

        // Guardamos el nombre de la foto en el registro de la BBDD
        await insertPhotoQuery(photoName, idNews)
        
      }
    }
    

    res.send({
      status: "Ok",
      message: "Noticia modificada",
      data: {
        category,
        title,
        summary,
        body,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editNews;
