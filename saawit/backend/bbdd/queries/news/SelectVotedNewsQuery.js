"use strict";

const getConnection = require("../../getConnection");

const SelectVotedNewsQuery = async (idUser) => {
  
  let connection;
  try {
    connection = await getConnection();

    const [votedNews] = await connection.query(
      `
    SELECT idNews, value FROM votes WHERE idUser = ?`,
      [idUser]
    );
    
    return (votedNews);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = SelectVotedNewsQuery;
