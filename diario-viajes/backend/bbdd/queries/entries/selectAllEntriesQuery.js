const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectAllEntriesQuery = async (loggedUserId, search) => {
  let connection;

  try {
    connection = await getConnection();

    let mySqlQuery = `
      SELECT E.id, E.title, E.place, E.description, E.idUser, AVG(IFNULL(V.value, 0)) AS votes, E.createdAt, MAX(V2.value) voteByLoggedUser
      FROM entries E
      LEFT JOIN entryVotes V ON E.id = V.idEntry
      LEFT JOIN entryVotes V2 ON (E.id = V2.idEntry AND V2.idUser = ?)
    `;

    if (search) {
      mySqlQuery +=
        " WHERE E.title LIKE ? OR E.place LIKE ? OR E.description LIKE ? ";
    }

    mySqlQuery += " GROUP BY E.id;";

    const [entries] = await connection.query(mySqlQuery, [
      loggedUserId,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);

    if (entries.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return entries;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllEntriesQuery;
