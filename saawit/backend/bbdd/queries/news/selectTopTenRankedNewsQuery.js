"use strict";
const getConnection = require("../../getConnection");

const selectTopTenRankedNewsQuery = async () => {
  let connection;
  try {
    connection = await getConnection();
    const [newsOrderedByFeedback] = await connection.query(
      `SELECT id, feedback, category, idUser, title, summary, body, createdAt FROM news ORDER BY feedback DESC limit 10;`
    );
    
    return newsOrderedByFeedback;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectTopTenRankedNewsQuery;
