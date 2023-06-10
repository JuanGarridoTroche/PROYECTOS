"use strict";
const getConnection = require("../../getConnection");

const selectNewsByDateQuery = async (dateFrom, dateTo) => {
  let connection;
  try {
    connection = await getConnection();

    // Formateamos las fechas para que coincida el formato con el guardado en MySQL
    const dateFromArray = dateFrom.split('/');
    const mySQLdateFrom = new Date(`${dateFromArray[2]}-${dateFromArray[1]}-${dateFromArray[0]} 00:00:00`);
    
    const dateToArray = dateTo.split('/');
    const mySQLdateTo = new Date(`${dateToArray[2]}-${dateToArray[1]}-${dateToArray[0]} 23:59:59`)

    const [newsByDate] = await connection.query(
      `SELECT id, feedback, category, idUser, title, summary, body, createdAt 
        FROM news 
        WHERE createdAt 
        BETWEEN ? AND ?`,
        [mySQLdateFrom, mySQLdateTo]
    );
    return newsByDate;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectNewsByDateQuery;
