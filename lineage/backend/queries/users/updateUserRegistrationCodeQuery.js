const { generateError } = require("../../helpers");
const getConnection = require("../../BBDD/getConnection");

const updateUserRegistrationCodeQuery = async (registrationCode) => {
  let connection;

  try {
    connection = await getConnection();

    // Busco el user con el registrationCode enviado
    const [user] = await connection.query(
      `
      SELECT id FROM users WHERE registrationCode = ?`,
      [registrationCode]
    );   

    // Si no existe ningún usuario con ese código de registro lanzamos un error.
    if (user.length < 1 ) {
      throw generateError('Código de registro incorrecto', 404);
    }


    // Actualizamos el usuario
    await connection.query(
      `UPDATE users SET active = true, registrationCode = null, tries = 0, modifiedAt = ? WHERE registrationCode = ?`,
      [new Date(), registrationCode]
    )

    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserRegistrationCodeQuery;