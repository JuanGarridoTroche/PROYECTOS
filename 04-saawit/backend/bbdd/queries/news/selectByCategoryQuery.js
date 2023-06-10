"use strict";
const getConnection = require("../../getConnection");

const selectByCategoryQuery = async (category) => {
  let connection;
  try {
    connection = await getConnection();

   
    const [newsByCategory] = await connection.query(
      `SELECT N.id,  N.feedback, N.category, N.idUser, N.title, N.summary, N.body, N.createdAt, PN.name as photoName
      FROM news N
      LEFT JOIN photoNews PN ON N.id = PN.idNews
      WHERE category = ?
      ORDER BY createdAt DESC`,
        [category]
    );
    return newsByCategory;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectByCategoryQuery;