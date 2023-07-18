'use strict'
require('dotenv').config();
const getConnection = require("./getConnection");
const bcrypt = require('bcrypt');
const {ADMIN_PASS} = process.env;

const initDB = async()=> {
  let connection;
  try {
    connection = await getConnection();

    console.log("Borrando tablas...");
    await connection.query("DROP TABLE IF EXISTS contacts");
    await connection.query("DROP TABLE IF EXISTS used_techs");
    await connection.query("DROP TABLE IF EXISTS technologies");
    await connection.query("DROP TABLE IF EXISTS projects");
    await connection.query("DROP TABLE IF EXISTS curriculum_educations");
    await connection.query("DROP TABLE IF EXISTS educations");
    await connection.query("DROP TABLE IF EXISTS curriculum_skills");
    await connection.query("DROP TABLE IF EXISTS skills");
    await connection.query("DROP TABLE IF EXISTS curriculum_jobs");
    await connection.query("DROP TABLE IF EXISTS jobs");
    await connection.query("DROP TABLE IF EXISTS curriculums");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	      firstName VARCHAR(100) NOT NULL,
	      lastName1 VARCHAR(100) NOT NULL,
        lastName2 VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,    
        image VARCHAR(50),
        registrationCode VARCHAR(100),
        recoverPassCode VARCHAR(20),
        address VARCHAR(200),
        postcode VARCHAR(5),
        locality VARCHAR(100),
        province VARCHAR(50),
        country VARCHAR(50),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla users...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS curriculums (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),
        profile VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla curriculums...");
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),
        start TIMESTAMP NOT NULL,
        finish TIMESTAMP,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100),
        description VARCHAR(250),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla jobs..."); 

    await connection.query(`
      CREATE TABLE IF NOT EXISTS curriculum_jobs (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,        
        idCurriculum INT UNSIGNED NOT NULL,
        FOREIGN KEY (idCurriculum) REFERENCES curriculums(id),
        idJob INT UNSIGNED NOT NULL,
        FOREIGN KEY (idJob) REFERENCES jobs(id)
      )
    `);
    console.log("tabla curriculum_jobs...");     
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        experience TINYINT UNSIGNED DEFAULT 0,
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla skills..."); 

    await connection.query(`
      CREATE TABLE IF NOT EXISTS curriculum_skills (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,        
        idCurriculum INT UNSIGNED NOT NULL,
        FOREIGN KEY (idCurriculum) REFERENCES curriculums(id),
        idSkill INT UNSIGNED NOT NULL,
        FOREIGN KEY (idSkill) REFERENCES skills(id)
      )
    `);
    console.log("tabla curriculum_skills...");
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS educations (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),    
        name VARCHAR(100) NOT NULL,
        school VARCHAR(100),
        start TIMESTAMP NOT NULL,
        finish TIMESTAMP,
        description VARCHAR(250),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla educations...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS curriculum_educations (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,        
        idCurriculum INT UNSIGNED NOT NULL,
        FOREIGN KEY (idCurriculum) REFERENCES curriculums(id),
        idEducation INT UNSIGNED NOT NULL,
        FOREIGN KEY (idEducation) REFERENCES educations(id)
      )
    `);
    console.log("tabla curriculum_educations...");   

    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id),    
        name VARCHAR(100) NOT NULL,
        video VARCHAR(100),
        repo VARCHAR(100),
        url VARCHAR(100),
        description VARCHAR(250),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla projects...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,   
        name VARCHAR(100) NOT NULL,
        description VARCHAR(250),
        createdAt TIMESTAMP NOT NULL,
        modifiedAt TIMESTAMP
      )
    `);
    console.log("tabla technologies...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS used_techs (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        idProject INT UNSIGNED NOT NULL,
        FOREIGN KEY (idProject) REFERENCES projects(id),
        idTechnology INT UNSIGNED NOT NULL,
        FOREIGN KEY (idTechnology) REFERENCES technologies(id)
      )
    `);
    console.log("tabla used_techs...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users(id), 
        type VARCHAR(100) NOT NULL,
        content VARCHAR(100) NOT NULL
      )
    `);
    console.log("tabla contacts...");
    console.log("¡Tablas creadas!");

    const adminPass = await bcrypt.hash(ADMIN_PASS, 10);

    // Insertamos el usuario administrador en nuestra Base de datos
    await connection.query(
      `
      INSERT INTO users (firstName, lastName1, lastName2, email, password, createdAt)
      VALUES ('Juan', 'Garrido', 'Troche', 'j.garridotroche@gmail.com', ?, ?)
      `,
      [adminPass, new Date()]
      );
    console.log("usuario 'administrador' creado");
  } catch (err) {
    console.error(err);
  } finally {
    if(connection) connection.release();
    process.exit();
  }

}

initDB();