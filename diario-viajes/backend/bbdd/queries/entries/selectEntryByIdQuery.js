const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectEntryByIdQuery = async (idEntry, loggedUserId) => {
  let connection;

  try {
    connection = await getConnection();

    const [entries] = await connection.query(
      `
                SELECT E.id, E.title, E.place, E.description, E.idUser, AVG(IFNULL(V.value, 0)) AS votes, E.createdAt, MAX(V2.value) voteByLoggedUser
                FROM entries E
                LEFT JOIN entryVotes V ON E.id = V.idEntry
                LEFT JOIN entryVotes V2 ON (E.id = V2.idEntry AND V2.idUser = ?)
                WHERE E.id = ?
                GROUP BY E.id
            `,
      [loggedUserId, idEntry]
    );

    const [photos] = await connection.query(
      `SELECT id, name FROM entryPhotos WHERE idEntry = ?`,
      [idEntry]
    );

    if (entries.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return {
      ...entries[0],
      photos,
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectEntryByIdQuery;
