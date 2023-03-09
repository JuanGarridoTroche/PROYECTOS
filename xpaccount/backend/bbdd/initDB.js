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

    await connection.query("DROP TABLE IF EXISTS types");
    await connection.query("DROP TABLE IF EXISTS entries");
    await connection.query("DROP TABLE IF EXISTS accounts");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    await connection.query(`
    	CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,		
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        birthday TIMESTAMP,
        firstName VARCHAR(100),
        lastName VARCHAR(200),
        dni VARCHAR(9),
        registrationCode VARCHAR(100),
        recoverPassCode VARCHAR(20),
        active BOOLEAN DEFAULT false,
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla users...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),			
        alias VARCHAR(50),
        bankName VARCHAR(100),
        ibanCode VARCHAR(4) NOT NULL,				
        entityCode VARCHAR(4) NOT NULL,
        officeCode VARCHAR(4),
        digitControl VARCHAR(2),
        number VARCHAR(10),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla accounts...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idAccount INT UNSIGNED NOT NULL,
        FOREIGN KEY (idAccount) REFERENCES accounts(id),	
        name VARCHAR(100) NOT NULL,
        amount DECIMAL(9,2) NOT NULL,
        concept VARCHAR(100),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla entries...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS types (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idEntry INT UNSIGNED NOT NULL,
        FOREIGN KEY (idEntry) REFERENCES entries(id),	
        name VARCHAR(100) NOT NULL,
        comment VARCHAR(200),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla types...");
    console.log("¡Tablas creadas!");

    // Encriptamos la contraseña del admin.
    const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    // Insertamos el usuario administrador.
    await connection.query(
      `
                INSERT INTO users (username, email, password, active, createdAt)
                VALUES ('admin', 'juan@darthvader.es', ?, true, ?)
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
