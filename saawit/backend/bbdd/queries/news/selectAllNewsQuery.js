"use strict";

const { generateError } = require("../../../helpers");
const getConnection = require("../../getConnection");

const selectAllNewsQuery = async ({
  keyword,
  category,
  orderBy,
  direction,
}) => {
  let connection;
  try {
    connection = await getConnection();
    const [news] = await connection.query(
      `
        SELECT 
          N.id, 
          N.category, 
          N.feedback, 
          N.idUser, 
          N.title, 
          N.summary, 
          N.body, 
          N.createdAt, 
          N.modifiedAt, 
          U.username,
          SUM(CASE WHEN V.value = true THEN 1 ELSE 0 END) AS positiveVotes,
          SUM(CASE WHEN V.value = false THEN -1 ELSE 0 END) AS negativeVotes 
        FROM news N
        LEFT JOIN votes V ON V.idNews = N.id 
        INNER JOIN users U ON U.id = N.idUser
        WHERE N.body LIKE ? AND N.category LIKE ?
        GROUP BY N.id
        ORDER BY N.createdAt DESC
      `,
      [`%${keyword}%`, `%${category}%`]
    );

    if (news.length < 1) {
      throw generateError(
        "Actualmente no existen noticias o ha habido un error",
        400
      );
    }

    for (const currentNews of news) {
      const totalVotes =
        Number(currentNews.positiveVotes) + Number(currentNews.negativeVotes);

      currentNews.totalVotes = totalVotes;

      const [photos] = await connection.query(
        `SELECT id, name FROM photoNews WHERE idNews = ?`,
        [currentNews.id]
      );

      currentNews.photos = photos;
    }

    let orderedNews;

    if(orderBy === 'votes' && direction === 'ASC') {
      orderedNews = news.sort((a, b) => a.totalVotes - b.totalVotes)
    } else if(orderBy === 'votes' && direction === 'DESC') {
      orderedNews = news.sort((a, b) => b.totalVotes - a.totalVotes)
    } else if(orderBy === 'createdAt' && direction === 'ASC') {
      orderedNews = news.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else {
      orderedNews = news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return orderedNews;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllNewsQuery;
