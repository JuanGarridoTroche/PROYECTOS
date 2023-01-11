"use strict";

const getConnection = require("../../getConnection");

const updateUserPhotoQuery = async (photo, idUser) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `
    UPDATE users SET photo = ?, modifiedAt = ? WHERE id = ?`,
      [photo, new Date(), idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserPhotoQuery;
