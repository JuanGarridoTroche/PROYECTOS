const {generateError} = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectPasswordByIdQuery = async (idUser) => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
    SELECT password FROM users WHERE id = ?`,
      [idUser]
    );

    if (users.length < 1) {
      throw generateError("Id incorrecto", 404);
    }
    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPasswordByIdQuery;
