"use strict";

const getConnection = require("../../getConnection");

const updateUserPasswordQuery = async (recoverPassCode, email) => {
  let connection;
  try {
    connection = await getConnection();
    
    await connection.query(
      `
    UPDATE users SET recoverPassCode = ?, modifiedAt = ? WHERE email = ?`,
      [recoverPassCode, new Date(), email]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserPasswordQuery;
