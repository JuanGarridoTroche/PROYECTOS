'use strict';
const mysql = require('mysql2/promise');
const { HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

// Almacenará el grupo de conexiones con nunestra Base de datos
let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = await mysql.createPool({
        connectionLimit: 10,
        host: HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        timezone: 'Z',
      });
    }
    // Devolvemos una conexión a nuestra Base de datos
    return await pool.getConnection();
  } catch (err) {
    console.error("Error: ", err);
    throw new Error('Error al conectar con la base de datos');
  }
};

// Exportamos la función
module.exports = getConnection;
