"use strict";
require("dotenv").config();

// Importamos la función que retorna una conexión libre con la BBDD.
const getConnection = require("./getConnection");

const bcrypt = require("bcrypt");

const initDB = async () => {
  let connection;

  try {
    // Intentamos obtener una conexión de las 10 conexiones libres que tenemos.
    connection = await getConnection();

    console.log("Borrando tablas...");

    await connection.query("DROP TABLE IF EXISTS photoNews");
    await connection.query("DROP TABLE IF EXISTS votes");
    await connection.query("DROP TABLE IF EXISTS news");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                bio VARCHAR(500),
                photo VARCHAR(100),
                role ENUM('admin', 'mod', 'user') DEFAULT 'user',
                registrationCode VARCHAR(100),
                recoverPassCode VARCHAR(20),
                active BOOLEAN DEFAULT false,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);
    console.log("tabla users...");

    await connection.query(`
        CREATE TABLE IF NOT EXISTS news (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            category ENUM('deportes', 'videojuegos', 'noticias', 'programación', 'viajes', 'tecnología', 'música', 'memes', 'general') DEFAULT 'general',
            feedback INT DEFAULT 0,	
            idUser INT UNSIGNED NOT NULL,
            FOREIGN KEY (idUser) REFERENCES users(id),
            title VARCHAR(100) NOT NULL,
            summary VARCHAR(250),
            body MEDIUMTEXT NOT NULL,
            createdAt TIMESTAMP NOT NULL,
            modifiedAt TIMESTAMP
            )
        `);

    console.log("tabla news...");

    await connection.query(`
        CREATE TABLE IF NOT EXISTS votes (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          value BOOLEAN NOT NULL,
          idUser INT UNSIGNED NOT NULL,
          FOREIGN KEY (idUSer) REFERENCES users(id),
          idNews INT UNSIGNED NOT NULL,
          FOREIGN KEY (idNews) REFERENCES news(id),
          createdAt TIMESTAMP NOT NULL
          )
        `);

    console.log("tabla votes...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS photoNews (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        idNews INT UNSIGNED NOT NULL,
        FOREIGN KEY (idNews) REFERENCES news(id),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
        )
    `);

    console.log("tabla photoNews...");
    console.log("¡Tablas creadas!");

    // Encriptamos la contraseña del admin.
    const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    // Insertamos el usuario administrador.
    await connection.query(
      `
                INSERT INTO users (username, email, password, role, active, createdAt)
                VALUES ('admin', 'juan@darthvader.es', ?, 'admin', true, ?)
            `,
      [adminPass, new Date()]
    );

    console.log("¡Usuario administrador creado!");
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) connection.release();

    // Cerramos el proceso.
    process.exit();
  }
};

// Ejecutamos la función initDB.
initDB();
