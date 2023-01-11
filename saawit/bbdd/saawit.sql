CREATE DATABASE IF NOT EXISTS saawit;
USE saawit;

/* Se eliminan las tablas de forma inversa a como se han creado */

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(100) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	photo VARCHAR(100),
	role ENUM('admin', 'mod', 'user') DEFAULT 'user',
	registrationCode VARCHAR(100),
	recoverPassCode VARCHAR(20),
	active BOOLEAN DEFAULT false,
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP);
    
CREATE TABLE IF NOT EXISTS news (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	category ENUM('deportes', 'videojuegos', 'noticias', 'programación', 'viajes', 'tecnología', 'música', 'memes', 'general') DEFAULT 'general',
	feedback INT DEFAULT 0,	
	idUser INT UNSIGNED NOT NULL,
	FOREIGN KEY (idUser) REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    photo VARCHAR(100),
    summary VARCHAR(250),
    body MEDIUMTEXT NOT NULL,
	createdAt TIMESTAMP NOT NULL,
    modifiedAt TIMESTAMP);
                
CREATE TABLE IF NOT EXISTS votes (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	value BOOLEAN NOT NULL DEFAULT false,
	idUser INT UNSIGNED NOT NULL,
	FOREIGN KEY (idUSer) REFERENCES users(id),
    idNews INT UNSIGNED NOT NULL,
	FOREIGN KEY (idNews) REFERENCES news(id),
	createdAt TIMESTAMP NOT NULL);