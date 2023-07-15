'use strict';
const mysql = require('mysql2/promise');

// Obtenemos las variables de entorno necesarias.
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_BBDD } = process.env;

// Variable que almacenará un grupo de conexiones con la BBDD.
let pool;

// Función que retorna una conexión libre con la base de datos.
const getConnection = async () => {
    try {
        // Si no hay un grupo de conexiones lo creamos.
        if (!pool) {
            pool = await mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_BBDD,
                timezone: 'Z',
            });
        }

        // Retornamos una conexión libre con la base de datos.
        return await pool.getConnection();
    } catch (err) {
        console.error(err);
        throw new Error('Error al conectar con MySQL');
    }
};

// Exportamos la función anterior.
module.exports = getConnection;
