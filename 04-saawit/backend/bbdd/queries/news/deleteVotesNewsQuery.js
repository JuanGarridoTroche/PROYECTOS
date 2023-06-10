"use strict";

const { generateError } = require("../../../helpers");
const getConnection = require("../../getConnection");

const deleteVotesNewsQuery = async (idNews) => {
  let connection;
  try {
    connection = await getConnection();
    const [votes] = await connection.query(
      `SELECT id FROM votes WHERE idNews = ?`,
      [idNews]
    ); 
    
    if(votes.length < 1) {
      return;
    }

    // Eliminamos los votos de la noticia que vamos a eliminar de la tabla votes
    await connection.query(`
    DELETE FROM votes WHERE idNews = ?`,
    [idNews]
    )
  } finally {
    if (connection) connection.release();
  }
};


module.exports = deleteVotesNewsQuery;
