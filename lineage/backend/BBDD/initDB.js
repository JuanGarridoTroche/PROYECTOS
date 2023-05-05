"use strict";
// Consulta del fichero .env
require("dotenv").config();

// Encriptamos la contraseña antes de subirla a la BBDD
const bcrypt = require("bcrypt");

// Importamos la función que retorna una conexión libre con la BBDD.
const getConnection = require("./getConnection");


const initDB = async () => {
  let connection;

  try {
    // Intentamos obtener una conexión de las 10 conexiones libres que tenemos.
    connection = await getConnection();

    console.log("Borrando tablas...");

    await connection.query("DROP TABLE IF EXISTS descends");
    await connection.query("DROP TABLE IF EXISTS items");
    await connection.query("DROP TABLE IF EXISTS lineages");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
              id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
              email VARCHAR(100) UNIQUE NOT NULL,
              password VARCHAR(100) NOT NULL,
              role ENUM('admin', 'mod', 'user') DEFAULT 'user' NOT NULL,
              first_name VARCHAR(100) NOT NULL,
              last_name1 VARCHAR(100) NOT NULL,
              last_name2 VARCHAR(100) NOT NULL,
              registrationCode VARCHAR(100),
              recoverPassCode VARCHAR(20),
              active BOOLEAN DEFAULT false,
              createdAt TIMESTAMP NOT NULL,
              modifiedAt TIMESTAMP
            )
        `);
    console.log("tabla users...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS lineages (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        lineage VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(900),	
        shield VARCHAR(100),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla lineages...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        id_lineage INT UNSIGNED NOT NULL,
        FOREIGN KEY (id_lineage) REFERENCES lineages(id),
        name VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla items...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS descends (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        id_lineage INT UNSIGNED NOT NULL,
        FOREIGN KEY (id_lineage) REFERENCES lineages(id),
        id_user INT UNSIGNED NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users(id),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);

    console.log("tabla descends...");
    console.log("¡Tablas creadas!");

    // Encriptamos la contraseña del admin.
    const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);    

    // Insertamos el usuario administrador.
    await connection.query(
      `
                INSERT INTO users (email, password, role, first_name, last_name1, last_name2, active, createdAt)
                VALUES ('juan@darthvader.es', ?, 'admin', 'Administrador', 'admin', 'admin', true, ?)
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
