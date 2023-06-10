"use strict";

// SIN USO

const getConnection = require("../../getConnection");

const selectAllVotesQuery = async ({idUser}) => {
  let connection;
  try {
    connection = await getConnection();

    const [votes] = await connection.query(
      `
    SELECT id, value, idUser, idNews FROM votes WHERE idUser = ? `,
      [idUser]
    );
      
    return votes;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllVotesQuery;