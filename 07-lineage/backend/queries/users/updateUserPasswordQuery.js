const getConnection = require("../../BBDD/getConnection");
const bcrypt = require('bcrypt');

const updateUserPasswordQuery = async (password, id) => {
  let connection;

  try {
    connection = await getConnection(); 
    
       // Encriptamos la contraseña
       const hashPass = await bcrypt.hash(password, 10);

    // Actualizamos el usuario
    await connection.query(
      `UPDATE users SET password = ?, recoverPassCode = null, active = 1, tries = 0,  modifiedAt = ? WHERE id = ?`,
      [hashPass, new Date(), id]
    )
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserPasswordQuery;