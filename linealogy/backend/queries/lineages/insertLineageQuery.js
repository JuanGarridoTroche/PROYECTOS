const {generateError} = require("../../helpers");
const getConnection = require("../../BBDD/getConnection");

const insertUserQuery = async ({lineage, description, shield}) => {
  let connection;

  try {
    // Conexión a BBDD
    connection = await getConnection();

    //Intentamos obtener un email con el que nos ha dado el usuario
    const [newLineage] = await connection.query(
      `
    SELECT id FROM users WHERE lineage = ?`,
      [lineage]
    );

    if (newLineage.length > 0) {
      throw generateError(
        "El apellido ya está creado.", 403
      );
    }

    await connection.query(
      `INSERT INTO lineages (lineage, description, shield, createdAt)
    VALUES (?, ?, ?, ?)`,
      [lineage, description, shield, new Date()]
    );
  } finally {
    // Cerramos la conexión a BBDD
    if (connection) connection.release();
  }
};

module.exports = insertUserQuery;
