'use strict';

const { generateError } = require('../../../helpers');
const getConnection = require('../../getConnection');


const selectCharactersInBodyQuery = async (characters) => {
  let connection;
  try {
    connection = await getConnection();
    const [searchBody] = await connection.query(
      `SELECT N.id,  N.feedback, N.category, N.idUser, N.title, N.summary, N.body, N.createdAt, PN.name as photoName
      FROM news N
      LEFT JOIN photoNews PN ON N.id = PN.idNews
      WHERE N.body LIKE "%"?"%" OR N.category LIKE "%"?"%" OR N.title LIKE "%"?"%" OR N.summary LIKE "%"?"%"
      ORDER BY N.id DESC`,
        [characters, characters, characters, characters]
    )   
    
    if(searchBody.length < 1) {
      throw generateError(`No existe ninguna noticia que contenga el filtro '${characters}'.`, 404);
    }
    return searchBody;
  } finally {
    if(connection) connection.release();
  }
}

module.exports = selectCharactersInBodyQuery;