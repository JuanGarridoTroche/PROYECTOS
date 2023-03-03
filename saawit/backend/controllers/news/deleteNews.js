"use strict";
const selectNewsByIdQuery = require("../../bbdd/queries/news/selectNewsByIdQuery");
const deletePhotoNewsQuery = require("../../bbdd/queries/news/deletePhotoNewsQuery");
const deleteNewsQuery = require("../../bbdd/queries/news/deleteNewsQuery");
const deleteVotesNewsQuery = require('../../bbdd/queries/news/deleteVotesNewsQuery')
const selectPhotoNewsByIdQuery = require('../../bbdd/queries/news/selectPhotoNewsByIdQuery');
const { generateError, deletePhoto } = require("../../helpers");

const deleteNews = async (req, res, next) => {
  try {
    const { idNews } = req.params;

    //Obtenemos la noticia
    const news = await selectNewsByIdQuery(idNews);
    const idUser = news.idUser;

    // Comprobamos que somos los propietarios de la news que vamos a borrar
    if(idUser !== req.user.id) {
      throw generateError("No eres propietario de esta noticia, no la puedes eliminar.", 403);
    }

    
    // Borramos los votos que tiene la noticia
    await deleteVotesNewsQuery(idNews);
    
    // Seleccionamos las imágenes pertenecientes a la noticia (máximo 3) que hay que eliminar
    const photoNews = await selectPhotoNewsByIdQuery(idNews);

    // Borramos la/s foto/s asociadas a la noticia de la carpeta uploads
    for(const value of Object.keys(photoNews)) {  
      if(photoNews[value].name) {
        await deletePhoto(photoNews[value].name);
      }
    }

    // Borramos los nombres de las fotos de photoNews
    const deletePhotoNews = await deletePhotoNewsQuery(idNews);


    // Borramos la noticia
    await deleteNewsQuery(idNews);

    res.send({
      status: "Ok",
      message: "Noticia eliminada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteNews;
