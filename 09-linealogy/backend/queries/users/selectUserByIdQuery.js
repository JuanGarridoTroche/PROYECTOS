const { generateError } = require("../../helpers");
const getConnection = require("../../BBDD/getConnection");

const selectUserByIdQuery = async (id) => {
  console.log(id);
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
    SELECT id, email, password, role, first_name, last_name1, last_name2, active, tries, createdAt, modifiedAt FROM users WHERE id = ?`,
      [id]
    );

    if (user.length < 1) {
      throw generateError("La cuenta no existe", 404);
    }
        
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdQuery;