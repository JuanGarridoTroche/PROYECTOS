const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertVoteQuery = async (value, idUser, idEntry) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si ya se ha votado esta entrada.
    const [votes] = await connection.query(
      `SELECT id FROM entryVotes WHERE idUser = ? AND idEntry = ?`,
      [idUser, idEntry]
    );

    if (votes.length > 0) {
      throw generateError("Ya has votado esta entrada", 403);
    }

    // Insertamos el voto.
    await connection.query(
      `
                INSERT INTO entryVotes (value, idUser, idEntry, createdAt) 
                VALUES (?, ?, ?, ?)
            `,
      [value, idUser, idEntry, new Date()]
    );

    // Calculamos la nueva media de la entrada

    const [[{ votes: newVotesAvg }]] = await connection.query(
      `
            SELECT AVG(IFNULL(V.value, 0)) AS votes
            FROM entries E
            LEFT JOIN entryVotes V ON E.id = V.idEntry
            WHERE E.id = ?
        `,
      [idEntry]
    );

    return newVotesAvg;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertVoteQuery;
