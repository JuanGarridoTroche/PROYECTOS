"use strict";

const { generateError, savePhoto } = require("../../helpers");
const insertNewsQuery = require("../../bbdd/queries/news/insertNewsQuery");
const insertPhotoQuery = require('../../bbdd/queries/news/insertPhotoQuery')

const createNews = async (req, res, next) => {
  try {
    const { title, body, summary } = req.body;
    let { category } = req.body;

    // Comprobar que los campos requeridos tengan algún valor (title y body)
    if (!title || !body) {
      throw generateError("Faltan campos", 400);
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
    if (!listOfCategories.find((e) => e === category)) category = "general";

    // Insertar la noticia en la BBDD con el id del usuario registrado pero solo los campos obligatorios
    const idNews = await insertNewsQuery(title, body, summary,  category, req.user.id);

    // Vamos a comprobar si hay fotos (máximo 3) y si tienen la extensión de una imagen válida
    const photos = [];

    // Si "req.files" tiene fotos, las guardamos
    if (req.files) {
      // Recorremos las fotos. Si existen más de 3 solo subirá las 3 primeras
      // Comprobamos que las 3 son imágenes
      
      for (const photo of Object.values(req.files).slice(0, 3)) {
        // Guardamos la foto en el disco
        const photoName = await savePhoto(photo, 1); 
        
        // Pusheamos el nombre de la foto al array de fotos
        photos.push(photoName);

        // Guardamos el nombre de la foto en el registro de la BBDD
        await insertPhotoQuery(photoName, idNews)
        
      }
    }
    //Comprobar si existe Imagen para subir y si es una imagen válida
    // if(photo) isImg(photo);

    res.send({
      status: "Ok",
      message: "Noticia subida correctamente",
      data: {
        id: idNews,
        title,
        summary,
        body,
        category,
        photos,
        idUser: req.user.id,
        createdAt: new Date(),
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createNews;
