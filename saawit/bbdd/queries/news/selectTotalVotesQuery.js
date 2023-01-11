"use strict";

const getConnection = require("../../getConnection");

const selectTotalVotesQuery = async (idNews) => {
  let connection;
  try {
    connection = await getConnection();

    const [positiveVotes] = await connection.query(
      `
    SELECT COUNT(id) AS positivos FROM votes WHERE idNews = ? AND value = 1`,
      [idNews]
    );

    const [negativeVotes] = await connection.query(
      `
    SELECT COUNT(id) AS negativos FROM votes WHERE idNews = ? AND value = 0`,
      [idNews]
    );
    // console.log('Positivos - negativos', positiveVotes[0].positivos, " - ", negativeVotes[0].negativos, " = ", positiveVotes[0].positivos - negativeVotes[0].negativos);
    
    return (positiveVotes[0].positivos - negativeVotes[0].negativos);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectTotalVotesQuery;
