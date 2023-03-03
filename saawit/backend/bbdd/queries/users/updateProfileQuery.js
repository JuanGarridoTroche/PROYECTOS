"use strict";

const getConnection = require("../../getConnection");
const bcrypt = require("bcrypt");

const updateUserPasswordQuery = async (
  username,
  email,
  bio,
  photoName,
  idUser
) => {
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `
    UPDATE users SET username = ?, email = ?, bio= ?, photo = ?, modifiedAt = ? WHERE id = ?`,
      [username, email, bio, photoName, new Date(), idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserPasswordQuery;
