"use strict";

const getConnection = require("../../getConnection");

const deletePhotoNewsQuery = async (idNews) => {
  let connection;
  try {
    connection = await getConnection();   

    // Eliminamos el/los registro/s de la/s foto/s de la tabla photoNews que pertenezcan a la noticia que vamos a eliminar
    await connection.query(`
    DELETE FROM photoNews WHERE idNews = ?`,
    [idNews]
    )
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deletePhotoNewsQuery;
